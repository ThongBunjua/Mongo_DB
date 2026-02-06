import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import corsHeaders from "@/lib/cors";
import bcrypt from "bcrypt";

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const user = await db.collection("user").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(user, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const updateDoc = {
      username: data.username,
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      status: data.status
    };

    if (data.password && data.password.trim() !== "") {
      updateDoc.password = await bcrypt.hash(data.password, 10);
    }

    await db.collection("user").updateOne({ _id: new ObjectId(id) }, { $set: updateDoc });
    return NextResponse.json({ message: "Updated" }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const client = await getClientPromise();
    const db = client.db("wad-01");
    await db.collection("user").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Deleted" }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 500, headers: corsHeaders });
  }
}