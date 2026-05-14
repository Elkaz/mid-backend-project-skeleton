import express from "express";
import {
  getCart,
  addItem,
  updateItem,
  deleteItem,
  checkout,
} from "#controllers/cart.js";
import { requireAuth, readAuth } from "#middlewares/auth.js";

const cartRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart routes
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the current user's active cart (with items)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart with items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                   nullable: true
 *                 status:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       event_id:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       price:
 *                         type: number
 *                       currency:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
cartRouter.get("/", readAuth, getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventId]
 *             properties:
 *               eventId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 default: 1
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
cartRouter.post("/items", readAuth, addItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     summary: Update cart line quantity (set to 0 to remove)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The cart line ID (cart_item.id)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Cart item updated
 *       204:
 *         description: Cart item removed (quantity was 0)
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
cartRouter.put("/items/:itemId", readAuth, updateItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Delete cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
cartRouter.delete("/items/:itemId", readAuth, deleteItem);

/**
 * @swagger
 * /api/cart/checkout:
 *   post:
 *     summary: Checkout active cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout successful
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
cartRouter.post("/checkout", requireAuth, checkout);

export default cartRouter;
