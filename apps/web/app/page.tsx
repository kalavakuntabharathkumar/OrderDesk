"use client";
import { useMemo, useState } from "react";

type Status = "pending" | "processing" | "ready" | "completed" | "cancelled";
type Order = { id: string; store: string; customer: string; item: string; total: number; status: Status; date: string };
const initial: Order[] = [
  { id: "OD-00521", store: "Central Market", customer: "Aarav Sharma", item: "Desk Lamp × 2", total: 850, status: "processing", date: "2026-10-21" },
  { id: "OD-00520", store: "North Square", customer: "Priya Nair", item: "Water Bottle × 1", total: 325, status: "pending", date: "2026-10-21" },
  { id: "OD-00519", store: "Lakeside Retail", customer: "Rohan Das", item: "Notebook Set × 3", total: 1050, status: "ready", date: "2026-10-20" },
  { id: "OD-00518", store: "City Junction", customer: "Meera Rao", item: "Travel Mug × 2", total: 900, status: "completed", date: "2026-10-20" },
  { id: "OD-00517", store: "Central Market", customer: "Kabir Shah", item: "Desk Lamp × 1", total: 425, status: "cancelled", date: "2026-10-19" },
  { id: "OD-00516", store: "North Square", customer: "Ananya Iyer", item: "Notebook Set × 2", total: 700, status: "processing", date: "2026-10-19" },
  { id: "OD-00515", store: "Lakeside Retail", customer: "Dev Patel", item: "Water Bottle × 4", total: 1300, status: "pending", date: "2026-10-18" }
];
const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
export default function Home() {
  const [orders, setOrders] = useState(initial);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState("");
  const [store, setStore] = useState("Central Market");
  const [item, setItem] = useState("Desk Lamp");
  const [total, setTotal] = useState("425");
  const filtered = useMemo(() => orders.filter(o => (status === "all" || o.status === status) && `${o.id} ${o.customer} ${o.store} ${o.item}`.toLowerCase().includes(search.toLowerCase())), [orders, search, status]);
  const updateStatus = (id: string, next: Status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: next } : o));
  function addOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!customer.trim() || Number(total) < 0) return;
    setOrders(prev => [{ id: `OD-${String(522 + prev.length - initial.length).padStart(5, "0")}`, store, customer: customer.trim(), item, total: Number(total), status: "pending", date: new Date().toISOString().slice(0, 10) }, ...prev]);
    setCustomer(""); setShowForm(false);
  }
  const count = (s: string) => orders.filter(o => s === "all" || o.status === s).length;
  return <main className="mx-auto max-w-7xl p-6 md:p-10">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-sm font-semibold uppercase tracking-[.2em] text-indigo-600">Retail operations</p><h1 className="mt-2 text-3xl font-bold tracking-tight">OrderDesk</h1><p className="mt-1 text-slate-500">Multi-store orders, one clear view.</p></div>
      <button onClick={() => setShowForm(!showForm)} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow hover:bg-indigo-700">{showForm ? "Close form" : "+ Create order"}</button>
    </header>
    <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[["Total orders", String(orders.length), "Across all stores"],["Pending",String(count("pending")),"Awaiting processing"],["In progress",String(count("processing")),"Being prepared"],["Completed",String(count("completed")),"Successfully fulfilled"]].map(([label,value,note]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div>)}
    </section>
    {showForm && <form onSubmit={addOrder} className="mb-6 grid gap-3 rounded-2xl border bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
      <input required value={customer} onChange={e=>setCustomer(e.target.value)} placeholder="Customer name" className="rounded-lg border p-3 text-sm"/>
      <select value={store} onChange={e=>setStore(e.target.value)} className="rounded-lg border p-3 text-sm">{["Central Market","North Square","Lakeside Retail","City Junction"].map(s=><option key={s}>{s}</option>)}</select>
      <select value={item} onChange={e=>setItem(e.target.value)} className="rounded-lg border p-3 text-sm">{["Desk Lamp","Water Bottle","Notebook Set","Travel Mug"].map(s=><option key={s}>{s}</option>)}</select>
      <input required type="number" min="0" value={total} onChange={e=>setTotal(e.target.value)} placeholder="Total (₹)" className="rounded-lg border p-3 text-sm"/>
      <button className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Save order</button>
    </form>}
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5"><div><h2 className="text-lg font-bold">Orders</h2><p className="text-sm text-slate-500">Search, filter and update order status</p></div><div className="flex flex-wrap gap-2">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders..." className="w-48 rounded-lg border px-3 py-2 text-sm"/>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-lg border px-3 py-2 text-sm"><option value="all">All statuses</option>{["pending","processing","ready","completed","cancelled"].map(s=><option key={s}>{s}</option>)}</select>
      </div></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Order","Store","Customer","Item","Total","Status","Date"].map(h=><th key={h} className="px-5 py-4 font-semibold">{h}</th>)}</tr></thead><tbody>{filtered.map(o=><tr key={o.id} className="border-t hover:bg-slate-50"><td className="px-5 py-4 font-semibold text-indigo-700">{o.id}</td><td className="whitespace-nowrap px-5 py-4">{o.store}</td><td className="whitespace-nowrap px-5 py-4">{o.customer}</td><td className="whitespace-nowrap px-5 py-4">{o.item}</td><td className="whitespace-nowrap px-5 py-4">{money(o.total)}</td><td className="px-5 py-4"><select aria-label={`Status for ${o.id}`} value={o.status} onChange={e=>updateStatus(o.id,e.target.value as Status)} className="rounded-full border px-2 py-1 text-xs capitalize"><option value="pending">Pending</option><option value="processing">Processing</option><option value="ready">Ready</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{o.date}</td></tr>)}</tbody></table>{filtered.length===0 && <p className="p-10 text-center text-slate-500">No matching orders found.</p>}</div>
      <footer className="border-t px-5 py-4 text-xs text-slate-500">Showing {filtered.length} of {orders.length} orders · Demo data stored in browser state</footer>
    </section>
  </main>;
}
