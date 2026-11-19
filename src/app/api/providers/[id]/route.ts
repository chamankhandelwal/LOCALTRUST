import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ProviderProfile, Review } from "@/lib/models";
import { jsonError } from "@/lib/http";
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) { try { await connectDB(); const { id } = await params; const profile = await ProviderProfile.findById(id).populate("userId", "name profileImage").lean(); if (!profile) return NextResponse.json({ error: "Provider not found" }, { status: 404 }); const reviews = await Review.find({ providerId: id }).populate("customerId", "name").sort({ createdAt: -1 }).limit(30).lean(); return NextResponse.json({ profile, reviews }); } catch (e) { return jsonError(e); } }
