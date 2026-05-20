import express from "express";
import { getOrders, getOrderById } from "#controllers/orders.js";
import { requireAuth } from "#middlewares/auth.js";

const ordersRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order history for authenticated users
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
ordersRouter.get("/", requireAuth, getOrders);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 */
ordersRouter.get("/:orderId", requireAuth, getOrderById);

export default ordersRouter;
