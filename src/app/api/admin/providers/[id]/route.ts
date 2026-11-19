import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Notification, ProviderProfile } from "@/lib/models";
import { jsonError } from "@/lib/http";
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { try { await requireRole("admin"); const { status } = z.object({ status: z.enum(["verified", "rejected"]) }).parse(await req.json()); await connectDB(); const { id } = await params; const profile = await ProviderProfile.findByIdAndUpdate(id, { verificationStatus: status }, { new: true }); if (!profile) return NextResponse.json({ error: "Provider not found" }, { status: 404 }); await Notification.create({ userId: profile.userId, title: "Provider application updated", message: `Your profile was ${status}.` }); return NextResponse.json({ profile }); } catch (e) { return jsonError(e); } }
