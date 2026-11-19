import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { ProviderProfile } from "@/lib/models";
import { jsonError } from "@/lib/http";
export async function GET(){try{const s=await requireRole("provider");await connectDB();const profile=await ProviderProfile.findOne({userId:s.id}).lean();return NextResponse.json({profile});}catch(e){return jsonError(e)}}
