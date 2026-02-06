import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req) {
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const users = await db.collection("user").find({}).project({ password: 0 }).toArray();
    return NextResponse.json(users, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { username, email, password, firstname, lastname } = data;

    if (!username || !email || !password) {
      return NextResponse.json({ message: "Missing data" }, { status: 400, headers: corsHeaders });
    }

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("user").insertOne({
      username,
      email,
      password: await bcrypt.hash(password, 10), 
      firstname,
      lastname,
      status: "ACTIVE"
    });

    return NextResponse.json(result, { status: 201, headers: corsHeaders });
  } catch (error) {
    let msg = error.toString();
    if (msg.includes("duplicate")) msg = "Username or Email already exists!";
    return NextResponse.json({ message: msg }, { status: 400, headers: corsHeaders });
  }
}