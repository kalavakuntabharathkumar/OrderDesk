import "dotenv/config";
import mongoose from "mongoose";
import { Order, Store } from "./models";

async function main() {
  await mongoose.connect(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/orderdesk");
  await Order.deleteMany({});
  await Store.deleteMany({});
  const stores = await Store.insertMany([
    { name: "Central Market", city: "Bengaluru", code: "BLR-01" },
    { name: "North Square", city: "Bengaluru", code: "BLR-02" },
    { name: "Lakeside Retail", city: "Mysuru", code: "MYS-01" },
    { name: "City Junction", city: "Chennai", code: "CHE-01" }
  ]);
  const statuses = ["pending", "processing", "ready", "completed", "cancelled"] as const;
  const orders = Array.from({ length: 40 }, (_, i) => {
    const store = stores[i % stores.length];
    const quantity = (i % 4) + 1;
    const unitPrice = 250 + (i % 7) * 75;
    return {
      orderNumber: `OD-${String(i + 1).padStart(5, "0")}`,
      storeId: store._id,
      customerName: ["Aarav Sharma", "Priya Nair", "Rohan Das", "Meera Rao"][i % 4],
      items: [{ sku: `SKU-${100 + i}`, name: ["Desk Lamp", "Water Bottle", "Notebook Set", "Travel Mug"][i % 4], quantity, unitPrice }],
      status: statuses[i % statuses.length],
      total: quantity * unitPrice,
      notes: i % 3 === 0 ? "Priority handling" : ""
    };
  });
  await Order.insertMany(orders);
  console.log(`Seeded ${stores.length} stores and ${orders.length} orders`);
  await mongoose.disconnect();
}
main().catch(error => { console.error(error); process.exit(1); });
