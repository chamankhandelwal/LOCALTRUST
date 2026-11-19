import { NextResponse } from "next/server";
export function jsonError(error: unknown) {
  const isError = error instanceof Error;
  const message = isError ? error.message : "Unexpected server error";
  const duplicate = typeof error === "object" && error !== null && "code" in error && error.code === 11000;
  const validation = isError && (error.name === "ZodError" || error.name === "ValidationError");
  const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : duplicate ? 409 : validation ? 400 : 500;
  const safeMessage = status === 500 ? "Unexpected server error" : duplicate ? "This record already exists" : message;
  return NextResponse.json({ error: safeMessage }, { status });
}
