import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import { Setting } from "@/models/Setting"

// Default platform settings
const defaultSettings = {
  allowNewRegistrations: true,
  requireEmailVerification: true,
  allowArtworkUploads: true,
  requireArtworkApproval: true,
  maxArtworksPerUser: 50,
  maxFileSizeMB: 10,
  allowedFileTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  maintenanceMode: false,
  maintenanceMessage: "The platform is currently under maintenance. Please check back later.",
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await dbConnect()

    // Get current settings or create default settings if none exist
    let settings = await Setting.findOne({})
    if (!settings) {
      settings = await Setting.create(defaultSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const updates = await request.json()

    // Validate updates
    const allowedFields = Object.keys(defaultSettings)
    const invalidFields = Object.keys(updates).filter(
      (field) => !allowedFields.includes(field)
    )

    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid fields: ${invalidFields.join(", ")}` },
        { status: 400 }
      )
    }

    await dbConnect()

    // Update settings
    const settings = await Setting.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true }
    )

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 