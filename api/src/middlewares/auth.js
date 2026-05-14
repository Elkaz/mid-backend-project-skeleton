import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Read token if it exists
// Allows both logged-in users and guests
export function readAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req.user = null;
      req.guest = null;
      return next();
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    if (payload.type === "guest") {
      req.user = null;
      req.guest = {
        type: "guest",
        guest_id: payload.guest_id,
      };
      return next();
    }

    req.user = payload;
    req.guest = null;
    return next();
  } catch (error) {
    req.user = null;
    req.guest = null;
    return next();
  }
}

// Only real logged-in users can access protected routes
export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    if (payload.type === "guest") {
      return res.status(401).json({ error: "Login required" });
    }

    req.user = payload;
    req.guest = null;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}