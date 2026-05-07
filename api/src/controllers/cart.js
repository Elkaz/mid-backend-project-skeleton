import knex from "#configs/database.js";

export async function getCart(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    let cart = await knex("cart")
      .where({ user_id: userId, status: "active" })
      .first();

    if (!cart) {
      [cart] = await knex("cart")
        .insert({ user_id: userId, status: "active" })
        .returning("*");
    }

    const items = await knex("cart_item")
      .where({ cart_id: cart.id })
      .join("event", "cart_item.event_id", "event.id")
      .select(
        "cart_item.id",
        "cart_item.quantity",
        "event.title",
        "event.price",
        "event.currency",
      );

    res.json({ cart, items });
  } catch (err) {
    res.status(500).json({ error: "Failed to get cart" });
  }
}

// POST /api/cart/items
export async function addItem(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const { event_id, quantity = 1 } = req.body;

    if (!Number.isInteger(event_id)) {
      return res
        .status(400)
        .json({ error: "event_id must be a valid integer" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "quantity must be a positive integer" });
    }

    let cart = await knex("cart")
      .where({ user_id: userId, status: "active" })
      .first();

    if (!cart) {
      [cart] = await knex("cart")
        .insert({ user_id: userId, status: "active" })
        .returning("*");
    }

    const existing = await knex("cart_item")
      .where({ cart_id: cart.id, event_id })
      .first();

    if (existing) {
      await knex("cart_item")
        .where({ id: existing.id, cart_id: cart.id })
        .update({
          quantity: existing.quantity + quantity,
        });

      return res.json({ message: "Quantity updated" });
    }

    await knex("cart_item").insert({
      cart_id: cart.id,
      event_id,
      quantity,
    });

    return res.status(201).json({ message: "Item added" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to add item" });
  }
}

// PUT /api/cart/items/:itemId
export async function updateItem(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: "quantity is required" });
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({
        error: "quantity must be a valid integer (0 or greater)",
      });
    }

    const cart = await knex("cart")
      .where({ user_id: userId, status: "active" })
      .first();

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    if (parsedQuantity === 0) {
      const deleted = await knex("cart_item")
        .where({ id: itemId, cart_id: cart.id })
        .del();

      if (!deleted) {
        return res.status(404).json({ error: "Item not found" });
      }

      return res.json({ message: "Item removed" });
    }

    const updated = await knex("cart_item")
      .where({ id: itemId, cart_id: cart.id })
      .update({ quantity: parsedQuantity });

    if (!updated) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.json({ message: "Item updated" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update item" });
  }
}
