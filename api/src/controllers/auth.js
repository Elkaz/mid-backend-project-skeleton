import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import knex from "#configs/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        error: "password must be at least 6 characters",
      });
    }

    const existingUser = await knex("app_user").where({ email }).first();

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertedRows = await knex("app_user")
      .insert({
        name: name ?? null,
        email,
        password: hashedPassword,
      })
      .returning(["id", "name", "email"]);

    const user = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Signup failed",
    });
  }
}

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

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
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

export async function getMe(req, res) {
  try {
    const user = await knex("app_user")
      .where({ id: req.user.id })
      .select("id", "name", "email")
      .first();

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch user",
    });
  }
}
