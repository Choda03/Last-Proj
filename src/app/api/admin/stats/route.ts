import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { User } from '@/models/User'
import { Artwork } from '@/models/Artwork'

interface ArtworkWithViews extends Pick<IArtwork, "views"> {}

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

    // Get total users
    const totalUsers = await User.countDocuments()

    // Get active users (users who logged in this month)
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: oneMonthAgo },
    })

    // Get total artworks
    const totalArtworks = await Artwork.countDocuments()

    // Get total views (sum of all artwork views)
    const artworks = await Artwork.find({}, "views").lean() as ArtworkWithViews[]
    const totalViews = artworks.reduce((sum: number, artwork: ArtworkWithViews) => 
      sum + (artwork.views || 0), 0
    )

    return NextResponse.json({
      totalUsers,
      totalArtworks,
      totalViews,
      activeUsers,
    })
  } catch (error) {
    console.error("Failed to fetch admin stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 