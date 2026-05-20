import express from "express";
import eventsRouters from "./routers/events.js";

const app = express();

app.use(express.json());

app.use("/app/events", eventRoutes);

// global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

export default app;
