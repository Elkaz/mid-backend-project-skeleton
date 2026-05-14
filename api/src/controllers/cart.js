import knex from "#configs/database.js";

// Identify current cart owner from user token or guest token
function getCartOwner(req) {
  if (req.user?.id) {
    return { userId: req.user.id, guestToken: null };
  }

  if (req.guest?.guest_id) {
    return { userId: null, guestToken: req.guest.guest_id };
  }

  return null;
}

// Find active cart for current owner
async function findActiveCart(owner, db = knex) {
  if (owner.userId) {
    return db("cart")
      .where({ user_id: owner.userId, status: "active" })
      .first();
  }

  return db("cart")
    .where({ guest_token: owner.guestToken, status: "active" })
    .first();
}

// Create active cart for current owner
async function createActiveCart(owner, db = knex) {
  const data = { status: "active" };

  if (owner.userId) {
    data.user_id = owner.userId;
  } else {
    data.guest_token = owner.guestToken;
  }

  const insertedRows = await db("cart").insert(data).returning("*");
  return Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;
}

// Get cart for authenticated user or guest
export async function getCart(req, res) {
  try {
    const owner = getCartOwner(req);

    if (!owner) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let cart = await findActiveCart(owner);

    if (!cart) {
      cart = await createActiveCart(owner);
    }

    const items = await knex("cart_item")
      .where({ "cart_item.cart_id": cart.id })
      .join("event", "cart_item.event_id", "event.id")
      .select(
        "cart_item.id",
        "cart_item.event_id",
        "cart_item.quantity",
        "event.title",
        "event.price",
        "event.currency"
      );

    return res.status(200).json({
      id: cart.id,
      user_id: cart.user_id,
      guest_token: cart.guest_token,
      status: cart.status,
      items,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get cart" });
  }
}

// Add item for authenticated user or guest
export async function addItem(req, res) {
  try {
    const owner = getCartOwner(req);

    if (!owner) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { eventId, quantity = 1 } = req.body;

    if (!Number.isInteger(eventId)) {
      return res.status(400).json({ error: "eventId must be a valid integer" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "quantity must be a positive integer" });
    }

    const event = await knex("event").where({ id: eventId }).first();

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    let cart = await findActiveCart(owner);

    if (!cart) {
      cart = await createActiveCart(owner);
    }

    const existingItem = await knex("cart_item")
      .where({ cart_id: cart.id, event_id: eventId })
      .first();

    if (existingItem) {
      await knex("cart_item")
        .where({ id: existingItem.id, cart_id: cart.id })
        .update({ quantity: existingItem.quantity + quantity });

      return res.status(200).json({ message: "Quantity updated" });
    }

    await knex("cart_item").insert({
      cart_id: cart.id,
      event_id: eventId,
      quantity,
    });

    return res.status(201).json({ message: "Item added" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to add item" });
  }
}

// Update item for authenticated user or guest
export async function updateItem(req, res) {
  try {
    const owner = getCartOwner(req);

    if (!owner) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ error: "itemId must be a valid positive integer" });
    }

    if (quantity === undefined) {
      return res.status(400).json({ error: "quantity is required" });
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({ error: "quantity must be a valid integer (0 or greater)" });
    }

    const cart = await findActiveCart(owner);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const existingItem = await knex("cart_item")
      .where({ id: itemId, cart_id: cart.id })
      .first();

    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (parsedQuantity === 0) {
      await knex("cart_item").where({ id: itemId, cart_id: cart.id }).del();
      return res.status(200).json({ message: "Item removed" });
    }

    await knex("cart_item")
      .where({ id: itemId, cart_id: cart.id })
      .update({ quantity: parsedQuantity });

    return res.status(200).json({ message: "Item updated" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update item" });
  }
}

// Delete item for authenticated user or guest
export async function deleteItem(req, res) {
  try {
    const owner = getCartOwner(req);

    if (!owner) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const itemId = Number(req.params.itemId);

    const cart = await findActiveCart(owner);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const deleted = await knex("cart_item")
      .where({ id: itemId, cart_id: cart.id })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.json({ message: "Item deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Delete failed" });
  }
}

// Checkout only for authenticated users
export async function checkout(req, res) {
  try {
    const userId = req.user.id;

    const result = await knex.transaction(async (trx) => {
      const cart = await trx("cart")
        .where({ user_id: userId, status: "active" })
        .first();

      if (!cart) {
        throw new Error("Cart not found");
      }

      const items = await trx("cart_item")
        .where({ cart_id: cart.id })
        .join("event", "cart_item.event_id", "event.id")
        .select("cart_item.event_id", "cart_item.quantity", "event.price");

      if (items.length === 0) {
        throw new Error("Cart is empty");
      }

      const totalPrice = items.reduce((sum, item) => {
        return sum + Number(item.price) * item.quantity;
      }, 0);

      const insertedOrder = await trx("customer_order")
        .insert({
          user_id: userId,
          total_price: totalPrice,
        })
        .returning("*");

      const order = insertedOrder[0];

      const orderItems = items.map((item) => ({
        order_id: order.id,
        event_id: item.event_id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      await trx("order_item").insert(orderItems);

      await trx("cart").where({ id: cart.id }).update({ status: "ordered" });

      return order;
    });

    return res.status(200).json({
      message: "Checkout successful",
      order: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Checkout failed",
    });
  }
}