import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { ProviderProfile, User } from "@/lib/models";
import { setSession } from "@/lib/auth";
import { jsonError } from "@/lib/http";
const schema = z.object({ name: z.string().min(2).max(80), email: z.string().email(), password: z.string().min(8).max(100), role: z.enum(["customer", "provider"]).default("customer"), phone: z.string().max(24).optional(), category: z.string().optional(), city: z.string().optional(), locality: z.string().optional(), pinCode: z.string().max(12).optional() });
export async function POST(req: NextRequest) { try {
 const data = schema.parse(await req.json()); await connectDB();
 const user = await User.create({ name: data.name, email: data.email.toLowerCase(), password: await bcrypt.hash(data.password, 12), role: data.role, phone: data.phone, address: { city: data.city, locality: data.locality, pinCode: data.pinCode } });
 if (data.role === "provider") await ProviderProfile.create({ userId: user._id, businessName: data.name, category: data.category || "Other Services", serviceAreas: [{ city: data.city, locality: data.locality, pinCode: data.pinCode }] });
 const session = { id: String(user._id), name: user.name, email: user.email, role: user.role }; await setSession(session);
 return NextResponse.json({ user: session }, { status: 201 });
 } catch (e) { return jsonError(e); } }
