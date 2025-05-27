console.log("Loaded /api/admin/users/route.ts");
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { User } from "@/models/User"
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

interface ErrorWithName extends Error {
  name: string;
  message: string;
  stack?: string;
}

function isErrorWithName(error: unknown): error is ErrorWithName {
  return error instanceof Error;
}

// Initialize rate limiter - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

export async function GET() {
  console.log("API: Starting /api/admin/users GET");
  try {
    // Get client IP for rate limiting
    const ip = headers().get('x-forwarded-for') || 'unknown-ip'
    
    // Apply rate limiting
    try {
      await limiter.check(100, ip) // 100 requests per 15 minutes
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Check authentication and admin status
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized",
          message: "You don't have permission to access this resource" 
        },
        { status: 401 }
      )
    }

    await dbConnect()
    console.log("API: Connected to DB");

    // Only fetch necessary fields and exclude sensitive data
    let users = [];
    try {
      users = await User.find(
        {},
        {
          name: 1,
          email: 1,
          role: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          lastLogin: 1,
          _id: 1
        }
      ).sort({ createdAt: -1 }).lean();
      console.log(`API: Users fetched: ${Array.isArray(users) ? users.length : users}`);
    } catch (err) {
      console.error("API: Error in User.find()", err);
      return NextResponse.json(
        { error: "User query failed", message: err?.message || "Unknown error" },
        { status: 500 }
      );
    }
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error)
    
    // More specific error handling
    if (isErrorWithName(error)) {
      if (error.name === 'MongoNetworkError') {
        return NextResponse.json(
          { 
            error: 'Database connection error',
            message: 'Unable to connect to the database. Please try again later.'
          },
          { status: 503 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: error.message || 'An unexpected error occurred while fetching users.'
        },
        { status: 500 }
      )
    }
    
    // Fallback for unknown error types
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your request.'
      },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    // Get client IP for rate limiting
    const ip = headers().get('x-forwarded-for') || 'unknown-ip'
    
    // Apply rate limiting
    try {
      await limiter.check(100, ip) // 100 requests per 15 minutes
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Check authentication and admin status
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { role, status } = body

    if (!role && !status) {
      return NextResponse.json(
        { error: "No valid update fields provided" },
        { status: 400 }
      )
    }

    await dbConnect()

    const updateData: { role?: string; status?: string } = {}
    if (role) updateData.role = role
    if (status) updateData.status = status

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, select: "-password" }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Failed to update user:", error)
    
    // More specific error handling
    if (isErrorWithName(error)) {
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { 
            error: 'Validation error', 
            message: `Invalid data provided: ${error.message}`
          },
          { status: 400 }
        )
      }
      
      if (error.name === 'MongoNetworkError') {
        return NextResponse.json(
          { 
            error: 'Database connection error',
            message: 'Unable to connect to the database. Please try again later.'
          },
          { status: 503 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: error.message || 'An unexpected error occurred while updating the user.'
        },
        { status: 500 }
      )
    }
    
    // Fallback for unknown error types
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your request.'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    await dbConnect()

    // Prevent deleting the last admin
    const adminCount = await User.countDocuments({ role: "admin" })
    const userToDelete = await User.findById(userId)

    if (userToDelete?.role === "admin" && adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last admin user" },
        { status: 400 }
      )
    }

    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Failed to delete user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 