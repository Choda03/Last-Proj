import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { User } from '@/models/User'
import crypto from "crypto"
import { z } from "zod"

// Input validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: Request) {
  try {
    // Connect to database
    await dbConnect()

    // Parse and validate request body
    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json(
        { message: "If an account exists, you will receive a password reset email" },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to user
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    // TODO: Send email with reset link
    // For now, we'll just log the token
    console.log(`Password reset token for ${email}: ${resetToken}`)
    // In production, you would send an email with a link like:
    // `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

    return NextResponse.json(
      { message: "If an account exists, you will receive a password reset email" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Password reset request error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
} 