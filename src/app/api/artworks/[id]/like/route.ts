import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Artwork } from "@/models/Artwork";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const artworkId = params.id;

  const artwork = await Artwork.findById(artworkId);
  if (!artwork) {
    return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
  }

  if (!Array.isArray(artwork.likes)) {
  artwork.likes = [];
}
const hasLiked = artwork.likes.some((id: any) => id.toString() === userId);
  if (hasLiked) {
    artwork.likes = artwork.likes.filter((id: any) => id.toString() !== userId);
  } else {
    artwork.likes.push(userId);
  }
  await artwork.save();
  return NextResponse.json({ likes: artwork.likes, liked: !hasLiked });
}
