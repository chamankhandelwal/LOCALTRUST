import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { jsonError } from "@/lib/http";
const defaults = ["Electrician", "Plumber", "Carpenter", "Mechanic", "Tutor", "AC Repair", "Appliance Repair", "Cleaning", "Painting", "Other Services"];
export async function GET() { try { await connectDB(); let items = await Category.find({ isActive: true }).sort({ name: 1 }).lean(); if (!items.length) { try { await Category.insertMany(defaults.map(name => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") })), { ordered: false }); } catch {} items = await Category.find({ isActive: true }).sort({ name: 1 }).lean(); } return NextResponse.json({ items }); } catch (e) { return jsonError(e); } }
