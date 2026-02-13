import { verifyJWT } from "@/lib/auth";
import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

export async function OPTIONS(req) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

async function parseMultipartFormData(req) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    throw new Error("Invalid content-type");
  }
  return await req.formData();
}

export async function POST(req) {
  const user = verifyJWT(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const formData = await parseMultipartFormData(req);
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400, headers: corsHeaders });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: "Only image files allowed" }, { status: 400, headers: corsHeaders });
    }

    const ext = file.name.split(".").pop();
    const filename = uuidv4() + "." + ext;
    const savePath = path.join(process.cwd(), "public", "profile-images", filename);

    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(savePath, Buffer.from(arrayBuffer));

    const client = await getClientPromise();
    const db = client.db("wad-01");
    
    await db.collection("user").updateOne(
      { email: user.email },
      { $set: { profileImage: `/profile-images/${filename}` } }
    );

    return NextResponse.json({ imageUrl: `/profile-images/${filename}` }, { status: 200, headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({ message: "Upload failed" }, { status: 500, headers: corsHeaders });
  }
}