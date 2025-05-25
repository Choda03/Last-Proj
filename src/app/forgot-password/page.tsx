"use client"

import { useState } from "react"
import { Playfair_Display } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { toast } from "sonner"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      setIsSubmitted(true)
      toast.success("Password reset instructions sent to your email")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link href="/" className="flex items-center space-x-2">
              <span className={`${playfair.className} text-2xl font-bold`}>
                GalleryHub
              </span>
            </Link>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Card>
              <CardHeader>
                <CardTitle>Check Your Email</CardTitle>
                <CardDescription>
                  We've sent password reset instructions to your email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If an account exists with the email {email}, you will receive a password reset link.
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <div className="text-sm text-muted-foreground">
                  Didn't receive the email?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Try again
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="link"
                  className="w-full"
                  asChild
                >
                  <Link href="/login">
                    Return to login
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center space-x-2">
            <span className={`${playfair.className} text-2xl font-bold`}>
              GalleryHub
            </span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "GalleryHub has transformed how I discover and share art. The platform's intuitive design and 
              vibrant community have made it an essential part of my artistic journey."
            </p>
            <footer className="text-sm">Sarah Chen, Digital Artist</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className={`${playfair.className} text-2xl font-semibold tracking-tight`}>
              Forgot Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Enter your email address to receive a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                className="w-full"
                asChild
              >
                <Link href="/login">
                  Back to login
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 