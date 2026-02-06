import { ensureIndexes } from "@/lib/ensureIndexes";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await ensureIndexes();
    return NextResponse.json({ message: "Indexes ensured successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}