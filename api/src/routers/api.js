import express from "express";
import eventsRouter from "#routers/events.js";
import authRouter from "#routers/auth.js";
import cartRouter from "#routers/cart.js";
import ordersRouter from "#routers/orders.js";

const apiRouter = express.Router();

// Register all main API route groups under /api
apiRouter.use("/events", eventsRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", ordersRouter);

export default apiRouter;
