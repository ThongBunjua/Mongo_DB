import corsHeaders from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" }, { headers: corsHeaders });
  response.cookies.set("token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}