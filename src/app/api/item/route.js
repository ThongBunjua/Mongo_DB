import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";
import corsHeaders from "@/lib/cors";

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const client = await getClientPromise();
    const db = client.db("wad-01"); 

    const items = await db.collection("item").find({}).skip(skip).limit(limit).toArray();
    const total = await db.collection("item").countDocuments();

    return NextResponse.json({ items, total, totalPages: Math.ceil(total/limit) }, {
      headers: corsHeaders
    });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("item").insertOne({
      itemName: data.itemName,
      itemCategory: data.itemCategory,
      itemPrice: parseFloat(data.itemPrice),
      status: data.status || "Active"
    });

    return NextResponse.json(result, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 500, headers: corsHeaders });
  }
}