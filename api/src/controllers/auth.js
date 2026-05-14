import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import knex from "#configs/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Signup new user
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "name, email and password are required",
      });
    }

    const existingUser = await knex("app_user").where({ email }).first();

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertedUsers = await knex("app_user")
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .returning(["id", "name", "email"]);

    const user = insertedUsers[0];

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: "user",
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      message: "Signup successful",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Signup failed",
    });
  }
}

// Login existing user
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }

    const user = await knex("app_user").where({ email }).first();

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: "user",
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Login failed",
    });
  }
}

// Get current authenticated user
export async function me(req, res) {
  try {
    const user = await knex("app_user")
      .where({ id: req.user.id })
      .select("id", "name", "email", "created_at", "updated_at")
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
}

// Create guest token
export async function guestLogin(req, res) {
  try {
    const guestId = crypto.randomUUID();

    const token = jwt.sign(
      {
        type: "guest",
        guest_id: guestId,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      message: "Guest token created",
      token,
      guest: {
        type: "guest",
        guest_id: guestId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create guest token",
    });
  }
}
