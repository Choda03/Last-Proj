import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Artwork } from "@/models/Artwork";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const artworks = await Artwork.find({})
    .sort({ createdAt: -1 })
    .populate("artist", "name email role");
  return NextResponse.json(artworks);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get("imageId");
  if (!imageId) {
    return NextResponse.json({ error: "Missing imageId" }, { status: 400 });
  }
  await Artwork.findByIdAndDelete(imageId);
  return NextResponse.json({ message: "Image deleted successfully" });
} 