import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { setSession } from "@/lib/auth";
import { jsonError } from "@/lib/http";
export async function POST(req: NextRequest) { try { const { email, password } = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(await req.json()); await connectDB(); const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).select("+password name email role"); if (!user || !(await bcrypt.compare(password, user.password))) return NextResponse.json({ error: "Email or password is incorrect" }, { status: 401 }); const session = { id: String(user._id), name: user.name, email: user.email, role: user.role }; await setSession(session); return NextResponse.json({ user: session }); } catch (e) { return jsonError(e); } }
