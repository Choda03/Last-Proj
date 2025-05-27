import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Artwork } from "@/models/Artwork";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const artwork = await Artwork.findById(params.id).populate({ path: "comments.user", select: "name email image" });
  if (!artwork) {
    return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
  }
  return NextResponse.json({ comments: artwork.comments });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Comment text required" }, { status: 400 });
  }
  const artwork = await Artwork.findById(params.id);
  if (!artwork) {
    return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
  }
  artwork.comments.push({ user: userId, text, createdAt: new Date() });
  await artwork.save();
  return NextResponse.json({ comments: artwork.comments });
}
