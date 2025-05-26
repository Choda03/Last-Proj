"use client"

import { useState, useEffect } from "react"
import { Playfair_Display } from "next/font/google"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Heart, Share2, MessageCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ConfirmModal } from "@/components/ui/ConfirmModal"
import { categories as sharedCategories } from "@/constants/categories"

const playfair = Playfair_Display({ subsets: ["latin"] })

const categories = ["All", ...sharedCategories.map(cat => cat.id)]

const getCategoryTitle = (id: string) => sharedCategories.find(cat => cat.id === id)?.title || id

export default function GalleryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [artworks, setArtworks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowAuthModal(true)
    }
  }, [status])

  useEffect(() => {
    fetch("/api/artworks")
      .then(res => res.json())
      .then(data => setArtworks(Array.isArray(data) ? data : []))
  }, [])

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (artwork.artist?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (status === "loading") return null

  if (status === "unauthenticated") {
    return (
      <ConfirmModal
        open={showAuthModal}
        title="Authentication Required"
        description="You must be logged in to view the gallery."
        confirmText="Log in"
        cancelText="Cancel"
        onConfirm={() => router.push("/login")}
        onCancel={() => setShowAuthModal(false)}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent`}>
          Art Gallery
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover and explore exceptional artwork from talented artists around the world.
          Find pieces that inspire and resonate with your artistic journey.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search artworks or artists..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((categoryId) => (
            <Button
              key={categoryId}
              variant={selectedCategory === categoryId ? "default" : "outline"}
              onClick={() => setSelectedCategory(categoryId)}
              className="text-sm"
            >
              {categoryId === "All"
                ? "All"
                : getCategoryTitle(categoryId)}
            </Button>
          ))}
        </div>
      </div>

      {/* Artwork Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArtworks.map((artwork) => (
          <Card key={artwork._id} className="group overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-1">{artwork.title}</CardTitle>
              <div className="text-xs text-muted-foreground mb-1">{getCategoryTitle(artwork.category)}</div>
              <p className="text-sm text-muted-foreground">by {artwork.artist?.name || "Unknown"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg">
          Load More Artworks
        </Button>
      </div>
    </div>
  )
} 