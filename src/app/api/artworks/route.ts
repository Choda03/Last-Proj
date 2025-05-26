import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import dbConnect from "@/lib/dbConnect";
import { Artwork } from "@/models/Artwork";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const category = formData.get("category")?.toString();
    const tags = formData.get("tags")?.toString();
    const image = formData.get("image");

    // Basic validation
    if (!title || !description || !category || !image || typeof image === "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save image to /public/uploads
    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}-${image.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, new Uint8Array(buffer));
    const imageUrl = `/uploads/${fileName}`;

    // Save to MongoDB
    await dbConnect();
    const dummyArtistId = new mongoose.Types.ObjectId("000000000000000000000000"); // Dummy ID for testing
    const artwork = await Artwork.create({
      title,
      description,
      imageUrl,
      category,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      artist: dummyArtistId, // Required field
    });

    return NextResponse.json({ success: true, message: "Image uploaded successfully!", artwork });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const artworks = await Artwork.find().sort({ createdAt: -1 });
    return NextResponse.json(artworks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch artworks" }, { status: 500 });
  }
} 