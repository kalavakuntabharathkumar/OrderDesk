import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { Order, Store } from "./models";

const app = express();
app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "orderdesk-api" }));

app.get("/api/stores", async (_req, res, next) => {
  try { res.json(await Store.find().sort({ name: 1 }).lean()); }
  catch (error) { next(error); }
});

app.get("/api/orders", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.storeId) filter.storeId = req.query.storeId;
    if (req.query.search) {
      const search = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ orderNumber: new RegExp(search, "i") }, { customerName: new RegExp(search, "i") }];
    }
    const [orders, total] = await Promise.all([
      Order.find(filter).populate("storeId", "name code").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments(filter)
    ]);
    res.json({ data: orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
});

app.get("/api/orders/:id", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("storeId", "name code");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) { next(error); }
});

app.post("/api/orders", async (req, res, next) => {
  try {
    const { orderNumber, storeId, customerName, items, total, notes } = req.body;
    if (!orderNumber || !storeId || !customerName || !Array.isArray(items) || !items.length || !Number.isFinite(Number(total)) || Number(total) < 0) {
      return res.status(400).json({ error: "orderNumber, storeId, customerName, non-empty items and non-negative total are required" });
    }
    const order = await Order.create({ orderNumber, storeId, customerName, items, total: Number(total), notes });
    res.status(201).json(order);
  } catch (error) { next(error); }
});

app.patch("/api/orders/:id", async (req, res, next) => {
  try {
    const allowed = ["status", "notes", "customerName"] as const;
    const update: Record<string, unknown> = {};
    for (const key of allowed) if (req.body[key] !== undefined) update[key] = req.body[key];
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) { next(error); }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : "Unexpected server error";
  res.status(500).json({ error: message });
});

const port = Number(process.env.PORT) || 4000;
mongoose.connect(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/orderdesk")
  .then(() => app.listen(port, () => console.log(`OrderDesk API listening on ${port}`)))
  .catch(error => { console.error("MongoDB connection failed", error); process.exit(1); });
