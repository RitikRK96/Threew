// server.js
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// Build allowed origins (supports comma-separated CLIENT_ORIGINS)
const rawOrigins = process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "";
const defaultDevOrigin = "http://localhost:5173";
const allowedOrigins = Array.from(
  new Set(
    [defaultDevOrigin]
      .concat(rawOrigins.split(","))
      .map((s) => s && s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/\/$/, ""))
  )
);

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

connectDB();

// Trust proxy for rate limiting / logs if behind reverse proxy
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", 1);
}

// Security & perf middlewares
app.use(helmet());
app.use(compression());

// CORS (dynamic origin match; normalizes trailing slash)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalized)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    }
  })
);
// Logs (skip noisy in test)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}
// Basic rate limiting on API
const limiter = rateLimit({ windowMs: 60 * 1000, max: 300 });
app.use("/api/", limiter);
app.use(express.json());

// allow controllers to emit socket events
app.use((req, _res, next) => {
  req.io = io;
  next();
});

app.use("/api/users", userRoutes);

// Healthcheck
app.get(["/", "/health", "/healthz"], (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
server.listen(PORT, HOST, () => console.log(`🚀 Server running on http://${HOST}:${PORT}`));