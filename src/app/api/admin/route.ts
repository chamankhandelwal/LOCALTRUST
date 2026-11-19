import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Booking, ProviderProfile, User } from "@/lib/models";
import { jsonError } from "@/lib/http";
export async function GET() { try { await requireRole("admin"); await connectDB(); const [customers, providers, bookings, pending, latest] = await Promise.all([User.countDocuments({ role: "customer" }), ProviderProfile.countDocuments(), Booking.countDocuments(), ProviderProfile.find({ verificationStatus: "pending" }).populate("userId", "name email").lean(), Booking.find().sort({ createdAt: -1 }).limit(10).lean()]); return NextResponse.json({ customers, providers, bookings, pending, latest }); } catch (e) { return jsonError(e); } }
