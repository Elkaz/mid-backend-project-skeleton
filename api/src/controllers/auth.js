import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import knex from "#configs/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await knex("app_user").insert({
      name,
      email,
      password: hashedPassword,
    });

    const user = await knex("app_user").where({ email }).first();

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await knex("app_user").where({ email }).first();

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    const user = await knex("app_user")
      .where({ id: req.user.id })
      .select("id", "name", "email")
      .first();

    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch user" });
  }
}
