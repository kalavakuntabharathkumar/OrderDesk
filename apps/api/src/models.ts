import mongoose, { Schema } from "mongoose";

const StoreSchema = new Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, index: true }
}, { timestamps: true });

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
  customerName: { type: String, required: true, trim: true },
  items: [{ sku: String, name: String, quantity: { type: Number, min: 1 }, unitPrice: { type: Number, min: 0 } }],
  status: { type: String, enum: ["pending", "processing", "ready", "completed", "cancelled"], default: "pending", index: true },
  total: { type: Number, min: 0, required: true },
  notes: { type: String, default: "" }
}, { timestamps: true });

OrderSchema.index({ storeId: 1, status: 1, createdAt: -1 });
OrderSchema.index({ customerName: "text", orderNumber: "text" });

export const Store = mongoose.model("Store", StoreSchema);
export const Order = mongoose.model("Order", OrderSchema);
