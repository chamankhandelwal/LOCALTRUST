import { NextResponse } from "next/server";
import { sessionWithUser } from "@/lib/auth";
export async function GET() { return NextResponse.json({ user: await sessionWithUser() }); }
