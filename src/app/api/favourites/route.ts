import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Favourite } from "@/lib/models";
import { jsonError } from "@/lib/http";
export async function GET() { try { const s = await requireRole("customer"); await connectDB(); const items = await Favourite.find({ customerId: s.id }).populate({ path: "providerId", populate: { path: "userId", select: "name" } }).lean(); return NextResponse.json({ items }); } catch (e) { return jsonError(e); } }
export async function POST(req: NextRequest) { try { const s = await requireRole("customer"); const { providerId } = await req.json(); await connectDB(); const existing = await Favourite.findOne({ customerId: s.id, providerId }); if (existing) { await existing.deleteOne(); return NextResponse.json({ saved: false }); } await Favourite.create({ customerId: s.id, providerId }); return NextResponse.json({ saved: true }, { status: 201 }); } catch (e) { return jsonError(e); } }
