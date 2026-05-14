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
 *     summary: Get active cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart returned
 *       401:
 *         description: Unauthorized
 */
cartRouter.get("/", readAuth, getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Item added
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
cartRouter.post("/items", readAuth, addItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     summary: Update cart item quantity
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
 *         description: Item updated
 *       400:
 *         description: Bad request
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
