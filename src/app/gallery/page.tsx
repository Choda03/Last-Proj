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
import { toast } from "sonner"

const playfair = Playfair_Display({ subsets: ["latin"] })

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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [artworks, setArtworks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("recent")
  const [likeLoading, setLikeLoading] = useState<string | null>(null)

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

  // Like handler (optimistic UI)
  const handleLike = async (artworkId: string) => {
    setLikeLoading(artworkId)
    setArtworks((prev) => prev.map((a) => a._id === artworkId ? { ...a, likes: (a.likes || 0) + 1, liked: true } : a))
    try {
      await fetch(`/api/artworks/like?id=${artworkId}`, { method: "POST" })
    } catch {
      toast.error("Failed to like image")
      setArtworks((prev) => prev.map((a) => a._id === artworkId ? { ...a, likes: (a.likes || 1) - 1, liked: false } : a))
    } finally {
      setLikeLoading(null)
    }
  }

  // Share handler
  const handleShare = (artwork: any) => {
    const url = `${window.location.origin}/gallery?image=${artwork._id}`
    if (navigator.share) {
      navigator.share({ title: artwork.title, url })
    } else {
      navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }
  }

  // Download handler
  const handleDownload = (artwork: any) => {
    const link = document.createElement("a")
    link.href = artwork.imageUrl
    link.download = artwork.title || "artwork"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
    <div className="container mx-auto px-2 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-10 md:mb-16">
        <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent`}>Art Feed</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Scroll through beautiful artwork from our community. Like, share, and download your favorites!</p>
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

      {/* Feed Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {filteredArtworks.map((artwork) => (
          <div key={artwork._id} className="break-inside-avoid mb-6 rounded-xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden group transition-transform hover:-translate-y-1">
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3 gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-pink-400 hover:bg-white/20"
                  onClick={() => handleLike(artwork._id)}
                  disabled={likeLoading === artwork._id || artwork.liked}
                  aria-label="Like"
                >
                  <Heart className={`h-5 w-5 ${artwork.liked ? "fill-pink-500 text-pink-500" : ""}`} />
                  <span className="ml-1 text-xs">{artwork.likes || 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-blue-400 hover:bg-white/20"
                  onClick={() => handleShare(artwork)}
                  aria-label="Share"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-green-400 hover:bg-white/20"
                  onClick={() => handleDownload(artwork)}
                  aria-label="Download"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v12m0 0l-4-4m4 4l4-4m-8 8.25h8a2.25 2.25 0 002.25-2.25V17.25A2.25 2.25 0 0016.25 15h-8.5A2.25 2.25 0 005.5 17.25v.75A2.25 2.25 0 007.75 20.25z" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={artwork.artist?.image || "/default-avatar.png"}
                  alt={artwork.artist?.name || "Artist"}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span className="font-semibold text-sm">{artwork.artist?.name || "Unknown"}</span>
              </div>
              <CardTitle className="text-lg mb-1">{artwork.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-1">{artwork.category}</p>
              <p className="text-xs text-muted-foreground mb-1">{artwork.description}</p>
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {artwork.tags.map((tag: string) => (
                    <span key={tag} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
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