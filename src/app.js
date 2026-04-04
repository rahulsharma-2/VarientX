import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import experimentRoutes from "./routes/experiment.routes.js";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

export const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(express.static(publicDir));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "varientx"
  });
});

app.use("/experiment", experimentRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found.",
      statusCode: 404
    }
  });
});

app.use(errorHandler);
