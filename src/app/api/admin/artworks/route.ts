import { NextResponse } from "next/server"
import { getTypedSession } from "@/lib/getTypedSession"
import dbConnect from "@/lib/mongodb"
import { Artwork } from "@/models/Artwork"
import { User } from "@/models/User"
import { Session } from "next-auth"

export async function GET() {
  try {
    const session = await getTypedSession()

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await dbConnect()

    const artworks = await Artwork.find()
      .populate("artist", "name email")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(artworks)
  } catch (error) {
    console.error("Failed to fetch artworks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getTypedSession()

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const artworkId = searchParams.get("artworkId")

    if (!artworkId) {
      return NextResponse.json(
        { error: "Artwork ID is required" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { status } = body

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      )
    }

    await dbConnect()

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      artworkId,
      { $set: { status } },
      { new: true }
    ).populate("artist", "name email")

    if (!updatedArtwork) {
      return NextResponse.json(
        { error: "Artwork not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedArtwork)
  } catch (error) {
    console.error("Failed to update artwork:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getTypedSession()

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const artworkId = searchParams.get("artworkId")

    if (!artworkId) {
      return NextResponse.json(
        { error: "Artwork ID is required" },
        { status: 400 }
      )
    }

    await dbConnect()

    const deletedArtwork = await Artwork.findByIdAndDelete(artworkId)

    if (!deletedArtwork) {
      return NextResponse.json(
        { error: "Artwork not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Artwork deleted successfully" })
  } catch (error) {
    console.error("Failed to delete artwork:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 