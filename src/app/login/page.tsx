"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Playfair_Display } from "next/font/google"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import Link from "next/link"
import { Github, Mail } from "lucide-react"
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from "@/lib/validations/auth"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast.success("Logged in successfully!")
      router.push("/gallery")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || "Registration failed")
      }

      toast.success("Account created successfully!")
      setActiveTab("login")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true)
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/gallery",
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left side - Branding */}
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

      {/* Right side - Auth Forms */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className={`${playfair.className} text-2xl font-semibold tracking-tight`}>
              Welcome to GalleryHub
            </h1>
            <p className="text-sm text-muted-foreground">
              Join our community of artists and art enthusiasts
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Sign in to your account to continue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form
                    schema={loginSchema}
                    onSubmit={handleLogin}
                    defaultValues={{
                      email: "",
                      password: "",
                    }}
                  >
                    {({ register, formState: { errors } }) => (
                      <>
                        <FormField
                          label="Email"
                          type="email"
                          placeholder="name@example.com"
                          error={errors.email?.message}
                          {...register("email")}
                        />
                        <FormField
                          label="Password"
                          type="password"
                          error={errors.password?.message}
                          {...register("password")}
                        />
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                      </>
                    )}
                  </Form>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth("github")}
                      disabled={isLoading}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Github
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth("google")}
                      disabled={isLoading}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>

                  <div className="mt-4 text-center text-sm">
                    <Link
                      href="/forgot-password"
                      className="text-primary hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Join our community of artists and art enthusiasts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form
                    schema={registerSchema}
                    onSubmit={handleRegister}
                    defaultValues={{
                      name: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                    }}
                  >
                    {({ register, formState: { errors } }) => (
                      <>
                        <FormField
                          label="Full Name"
                          type="text"
                          placeholder="John Doe"
                          error={errors.name?.message}
                          {...register("name")}
                        />
                        <FormField
                          label="Email"
                          type="email"
                          placeholder="name@example.com"
                          error={errors.email?.message}
                          {...register("email")}
                        />
                        <FormField
                          label="Password"
                          type="password"
                          error={errors.password?.message}
                          description="Must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                          {...register("password")}
                        />
                        <FormField
                          label="Confirm Password"
                          type="password"
                          error={errors.confirmPassword?.message}
                          {...register("confirmPassword")}
                        />
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                      </>
                    )}
                  </Form>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth("github")}
                      disabled={isLoading}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Github
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth("google")}
                      disabled={isLoading}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 