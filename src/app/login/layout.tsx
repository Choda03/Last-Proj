import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - GalleryHub",
  description: "Sign in to your GalleryHub account to access your artwork and profile.",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 