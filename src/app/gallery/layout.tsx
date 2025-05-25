import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gallery - GalleryHub",
  description: "Explore and discover exceptional artwork from talented artists around the world.",
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 