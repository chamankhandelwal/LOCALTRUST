import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Booking, ProviderProfile, Review } from "@/lib/models";
import { jsonError } from "@/lib/http";
export async function POST(req: NextRequest) { try { const s = await requireRole("customer"); const d = z.object({ bookingId: z.string(), rating: z.number().int().min(1).max(5), comment: z.string().min(5).max(1200) }).parse(await req.json()); await connectDB(); const b = await Booking.findOne({ _id: d.bookingId, customerId: s.id, status: "Completed" }); if (!b) return NextResponse.json({ error: "Reviews are available after a completed booking" }, { status: 403 }); await Review.create({ ...d, customerId: s.id, providerId: b.providerId }); const stats = await Review.aggregate([{ $match: { providerId: b.providerId } }, { $group: { _id: "$providerId", average: { $avg: "$rating" }, total: { $sum: 1 } } }]); await ProviderProfile.findByIdAndUpdate(b.providerId, { averageRating: stats[0]?.average || 0, totalReviews: stats[0]?.total || 0 }); return NextResponse.json({ ok: true }, { status: 201 }); } catch (e) { return jsonError(e); } }
