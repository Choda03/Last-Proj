"use client"

import { Playfair_Display } from "next/font/google"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Palette, Camera, Brush, Pencil, Scissors, Image as ImageIcon, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ConfirmModal } from "@/components/ui/ConfirmModal"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function CategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowAuthModal(true)
    }
  }, [status])

  if (status === "loading") return null

  if (status === "unauthenticated") {
    return (
      <ConfirmModal
        open={showAuthModal}
        title="Authentication Required"
        description="You must be logged in to view categories."
        confirmText="Log in"
        cancelText="Cancel"
        onConfirm={() => router.push("/login")}
        onCancel={() => setShowAuthModal(false)}
      />
    )
  }

  const categories = [
    {
      id: "abstract",
      title: "Abstract Art",
      description: "Explore non-representational artwork that uses shapes, colors, and forms to achieve its effect.",
      icon: Palette,
      image: "https://source.unsplash.com/random/800x600?abstract-art",
      count: 1234,
    },
    {
      id: "photography",
      title: "Photography",
      description: "Discover stunning photographs capturing moments, landscapes, and artistic expressions.",
      icon: Camera,
      image: "https://source.unsplash.com/random/800x600?photography",
      count: 2156,
    },
    {
      id: "painting",
      title: "Painting",
      description: "View traditional and contemporary paintings in various styles and techniques.",
      icon: Brush,
      image: "https://source.unsplash.com/random/800x600?painting",
      count: 3421,
    },
    {
      id: "drawing",
      title: "Drawing",
      description: "Explore sketches, illustrations, and drawings in different mediums.",
      icon: Pencil,
      image: "https://source.unsplash.com/random/800x600?drawing",
      count: 1876,
    },
    {
      id: "digital",
      title: "Digital Art",
      description: "Discover artwork created using digital technology and tools.",
      icon: ImageIcon,
      image: "https://source.unsplash.com/random/800x600?digital-art",
      count: 2987,
    },
    {
      id: "sculpture",
      title: "Sculpture",
      description: "View three-dimensional artworks created by shaping or combining materials.",
      icon: Scissors,
      image: "https://source.unsplash.com/random/800x600?sculpture",
      count: 945,
    },
    {
      id: "portrait",
      title: "Portrait",
      description: "Explore artistic representations of people, capturing their likeness and personality.",
      icon: Users,
      image: "https://source.unsplash.com/random/800x600?portrait",
      count: 1678,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent`}>
          Art Categories
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our diverse collection of artwork across different categories and styles.
          Find inspiration in various artistic expressions and mediums.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link key={category.id} href={`/gallery?category=${category.id}`}>
              <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{category.count} artworks</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <Button variant="ghost" className="group-hover:text-primary">
                    Explore Category
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Featured Artists Section */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <h2 className={`${playfair.className} text-3xl font-bold mb-4`}>
            Featured Artists
          </h2>
          <p className="text-muted-foreground">
            Discover talented artists from each category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((category) => (
            <Card key={category.id} className="group">
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <category.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-background overflow-hidden"
                    >
                      <img
                        src={`https://source.unsplash.com/random/100x100?artist=${i}`}
                        alt={`Artist ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-4 p-0 h-auto">
                  View All Artists
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 