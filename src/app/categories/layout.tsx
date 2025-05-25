import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Categories - GalleryHub",
  description: "Browse artwork by categories and discover different styles and mediums.",
}

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 