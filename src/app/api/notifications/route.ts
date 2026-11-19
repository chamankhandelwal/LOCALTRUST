import { NextRequest,NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/lib/models";
import { jsonError } from "@/lib/http";
export async function GET(){try{const s=await requireRole("customer","provider","admin");await connectDB();const items=await Notification.find({userId:s.id}).sort({createdAt:-1}).limit(50).lean();return NextResponse.json({items})}catch(e){return jsonError(e)}}
export async function PATCH(req:NextRequest){try{const s=await requireRole("customer","provider","admin");const {id}=z.object({id:z.string()}).parse(await req.json());await connectDB();const item=await Notification.findOneAndUpdate({_id:id,userId:s.id},{isRead:true},{new:true});return NextResponse.json({item})}catch(e){return jsonError(e)}}
