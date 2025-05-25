"use client"

import { useState } from "react"
import { Playfair_Display } from "next/font/google"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Heart, Share2, MessageCircle } from "lucide-react"

const playfair = Playfair_Display({ subsets: ["latin"] })

// Temporary mock data
const mockArtworks = [
  {
    id: 1,
    title: "Abstract Harmony",
    artist: "Sarah Chen",
    image: "https://source.unsplash.com/random/400x300?abstract",
    likes: 234,
    comments: 45,
    category: "Abstract",
  },
  {
    id: 2,
    title: "Urban Dreams",
    artist: "Michael Torres",
    image: "https://source.unsplash.com/random/400x300?city",
    likes: 189,
    comments: 32,
    category: "Urban",
  },
  {
    id: 3,
    title: "Nature's Whisper",
    artist: "Emma Wilson",
    image: "https://source.unsplash.com/random/400x300?nature",
    likes: 312,
    comments: 67,
    category: "Landscape",
  },
  // Add more mock artworks as needed
]

const categories = [
  "All",
  "Abstract",
  "Landscape",
  "Portrait",
  "Urban",
  "Digital",
  "Photography",
  "Sculpture",
]

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("recent")

  const filteredArtworks = mockArtworks.filter((artwork) => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Artwork Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArtworks.map((artwork) => (
          <Card key={artwork.id} className="group overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={artwork.image}
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
              <p className="text-sm text-muted-foreground">by {artwork.artist}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{artwork.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{artwork.comments}</span>
              </div>
            </CardFooter>
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