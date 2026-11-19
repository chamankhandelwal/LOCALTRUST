import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { jsonError } from "@/lib/http";
const schema=z.object({name:z.string().min(2).max(80),phone:z.string().max(24).optional(),locality:z.string().max(100).optional(),city:z.string().max(100).optional(),pinCode:z.string().max(12).optional()});
export async function PATCH(req:NextRequest){try{const s=await requireRole("customer","provider");const d=schema.parse(await req.json());await connectDB();const user=await User.findByIdAndUpdate(s.id,{name:d.name,phone:d.phone,address:{locality:d.locality,city:d.city,pinCode:d.pinCode}},{new:true}).select("name email phone address role").lean();return NextResponse.json({user});}catch(e){return jsonError(e)}}
