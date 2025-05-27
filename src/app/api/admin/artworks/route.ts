import { NextResponse } from "next/server"
import { getTypedSession } from "@/lib/getTypedSession"
import dbConnect from "@/lib/mongodb"
import { Artwork } from "@/models/Artwork"
import { User } from "@/models/User"
import { Session } from "next-auth"

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  id?: string | null;
};

export async function GET() {
  try {
    const session = await getTypedSession()
    const user = session?.user as SessionUser

    if (!user || user.role !== "admin") {
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

// This PATCH handler allows an admin to approve or reject an artwork by updating its status
export async function PATCH(req: Request) {
  try {
    // Get the current session and user
    const session = await getTypedSession()
    const user = session?.user as SessionUser

    // Only allow admins to perform this action
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Extract artworkId from the query parameters
    const { searchParams } = new URL(req.url)
    const artworkId = searchParams.get("artworkId")

    // If no artworkId is provided, return an error
    if (!artworkId) {
      return NextResponse.json(
        { error: "Artwork ID is required" },
        { status: 400 }
      )
    }

    // Parse the request body to get the new status
    const body = await req.json()
    const { status } = body

    // Validate the status value (must be "approved" or "rejected")
    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      )
    }

    // Connect to the database
    await dbConnect()

    // Update the artwork's status in the database
    // - Find the artwork by its ID
    // - Set the new status
    // - Return the updated artwork document (with artist info populated)
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      artworkId,
      { $set: { status } },
      { new: true }
    ).populate("artist", "name email")

    // If the artwork wasn't found, return a 404 error
    if (!updatedArtwork) {
      return NextResponse.json(
        { error: "Artwork not found" },
        { status: 404 }
      )
    }

    // Return the updated artwork as JSON
    return NextResponse.json(updatedArtwork)
  } catch (error) {
    // If there was an error, log it and return a 500 error
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
    const user = session?.user as SessionUser

    if (!user || user.role !== "admin") {
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