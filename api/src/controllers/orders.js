import knex from "#configs/database.js";

export async function getOrders(req, res) {
  try {
    const userId = req.user.id;

    const orders = await knex("customer_order")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    return res.json({ data: orders });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get orders" });
  }
}

export async function getOrderById(req, res) {
  try {
    const userId = req.user.id;
    const orderId = Number(req.params.orderId);

    const order = await knex("customer_order")
      .where({ id: orderId, user_id: userId })
      .first();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const items = await knex("order_item").where({ order_id: order.id });

    return res.json({
      ...order,
      items,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get order" });
  }
}
