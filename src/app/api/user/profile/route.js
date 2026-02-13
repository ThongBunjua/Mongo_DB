import { verifyJWT } from "@/lib/auth";
import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req) {
  const userDecoded = verifyJWT(req);
  if (!userDecoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  const client = await getClientPromise();
  const db = client.db("wad-01");
  const profile = await db.collection("user").findOne({ email: userDecoded.email });

  return NextResponse.json(profile, { headers: corsHeaders });
}