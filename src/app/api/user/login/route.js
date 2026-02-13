import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  const { email, password } = await req.json();
  const client = await getClientPromise();
  const db = client.db("wad-01");
  const user = await db.collection("user").findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401, headers: corsHeaders });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({ message: "Login successful" }, { headers: corsHeaders });
  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}