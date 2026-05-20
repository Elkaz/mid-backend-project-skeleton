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
      const insertedRows = await knex("cart")
        .insert({ user_id: userId, status: "active" })
        .returning("*");

      cart = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;
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
        "event.currency",
      );

    return res.status(200).json({
      id: cart.id,
      user_id: cart.user_id,
      status: cart.status,
      items,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get cart" });
  }
}

export async function addItem(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const { eventId, quantity = 1 } = req.body;

    if (!Number.isInteger(eventId)) {
      return res.status(400).json({
        error: "eventId must be a valid integer",
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        error: "quantity must be a positive integer",
      });
    }

    const event = await knex("event").where({ id: eventId }).first();

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    let cart = await knex("cart")
      .where({ user_id: userId, status: "active" })
      .first();

    if (!cart) {
      const insertedRows = await knex("cart")
        .insert({ user_id: userId, status: "active" })
        .returning("*");

      cart = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;
    }

    const existingItem = await knex("cart_item")
      .where({ cart_id: cart.id, event_id: eventId })
      .first();

    if (existingItem) {
      await knex("cart_item")
        .where({ id: existingItem.id, cart_id: cart.id })
        .update({
          quantity: existingItem.quantity + quantity,
        });

      return res.status(200).json({
        message: "Quantity updated",
      });
    }

    await knex("cart_item").insert({
      cart_id: cart.id,
      event_id: eventId,
      quantity,
    });

    return res.status(201).json({
      message: "Item added",
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to add item" });
  }
}

export async function updateItem(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({
        error: "itemId must be a valid positive integer",
      });
    }

    if (quantity === undefined) {
      return res.status(400).json({
        error: "quantity is required",
      });
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

    const existingItem = await knex("cart_item")
      .where({ id: itemId, cart_id: cart.id })
      .first();

    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (parsedQuantity === 0) {
      await knex("cart_item").where({ id: itemId, cart_id: cart.id }).del();

      return res.status(200).json({
        message: "Item removed",
      });
    }

    await knex("cart_item")
      .where({ id: itemId, cart_id: cart.id })
      .update({ quantity: parsedQuantity });

    return res.status(200).json({
      message: "Item updated",
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update item" });
  }
}
