import express from "express";
import { signup, login, getMe } from "#controllers/auth.js";
import { requireAuth } from "#middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, getMe);

export default authRouter;
