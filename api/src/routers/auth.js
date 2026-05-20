import express from "express";
import { signup, login, me, guestLogin } from "#controllers/auth.js";
import { requireAuth } from "#middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/guest", guestLogin);
authRouter.get("/me", requireAuth, me);

export default authRouter;
