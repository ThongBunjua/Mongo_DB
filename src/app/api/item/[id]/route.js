import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb"; 
import corsHeaders from "@/lib/cors";

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const item = await db.collection("item").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(item, { headers: corsHeaders });
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

    await db.collection("item").updateOne(
      { _id: new ObjectId(id) },
      { $set: { 
          itemName: data.itemName, 
          itemCategory: data.itemCategory, 
          itemPrice: parseFloat(data.itemPrice),
          status: data.status 
        } 
      }
    );
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

    await db.collection("item").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Deleted" }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 500, headers: corsHeaders });
  }
}