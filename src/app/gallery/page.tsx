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

import React from "react"

export default function GalleryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [artworks, setArtworks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("recent")

  // Like state
  const [liking, setLiking] = useState<string | null>(null)
  // Comment modal state
  const [commentModal, setCommentModal] = useState<{ open: boolean; artwork: any | null }>({ open: false, artwork: null })
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loadingComments, setLoadingComments] = useState(false)
  const [postingComment, setPostingComment] = useState(false)

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

  // Like handler
  const handleLike = async (artworkId: string) => {
    setLiking(artworkId)
    try {
      const res = await fetch(`/api/artworks/${artworkId}/like`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to like artwork")
      const data = await res.json()
      setArtworks((prev) => prev.map((a) => a._id === artworkId ? { ...a, likes: data.likes } : a))
    } catch (err) {
      // optionally show error
    } finally {
      setLiking(null)
    }
  }

  // Download handler
  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = title || "artwork"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Comment modal handlers
  const openCommentModal = async (artwork: any) => {
    setCommentModal({ open: true, artwork })
    setLoadingComments(true)
    try {
      const res = await fetch(`/api/artworks/${artwork._id}/comments`)
      if (!res.ok) throw new Error("Failed to fetch comments")
      const data = await res.json()
      setComments(data.comments)
    } catch (err) {
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }
  const closeCommentModal = () => {
    setCommentModal({ open: false, artwork: null })
    setComments([])
    setNewComment("")
  }
  const handleAddComment = async () => {
    if (!commentModal.artwork || !newComment.trim()) return
    setPostingComment(true)
    try {
      const res = await fetch(`/api/artworks/${commentModal.artwork._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment })
      })
      if (!res.ok) throw new Error("Failed to post comment")
      const data = await res.json()
      setComments(data.comments)
      setNewComment("")
    } catch (err) {
      // optionally show error
    } finally {
      setPostingComment(false)
    }
  }

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
                  {/* LIKE BUTTON */}
                  <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20" onClick={() => handleLike(artwork._id)}>
                    <Heart className="h-5 w-5" fill={Array.isArray(artwork.likes) && session?.user?.id && artwork.likes.includes(session.user.id) ? "#e11d48" : "none"} />
                    <span className="ml-1">{artwork.likes?.length || 0}</span>
                  </Button>
                  {/* DOWNLOAD BUTTON */}
                  <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20" onClick={() => handleDownload(artwork.imageUrl, artwork.title)}>
                    ⬇️
                  </Button>
                  {/* COMMENT BUTTON */}
                  <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20" onClick={() => openCommentModal(artwork)}>
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
    {/* Comment Modal */}
    {commentModal.open && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
          <button className="absolute top-2 right-2 text-xl" onClick={closeCommentModal}>&times;</button>
          <h2 className="text-lg font-bold mb-2">Comments</h2>
          {loadingComments ? (
            <div>Loading...</div>
          ) : (
            <div className="max-h-48 overflow-y-auto mb-2">
              {comments.length === 0 ? (
                <div className="text-sm text-muted-foreground">No comments yet.</div>
              ) : (
                comments.map((c, idx) => (
                  <div key={idx} className="mb-2 border-b pb-1">
                    <div className="font-semibold text-sm">{c.user?.name || "User"}</div>
                    <div className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</div>
                    <div>{c.text}</div>
                  </div>
                ))
              )}
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <Input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
              disabled={postingComment}
              onKeyDown={e => { if (e.key === "Enter") handleAddComment() }}
            />
            <Button onClick={handleAddComment} disabled={postingComment || !newComment.trim()}>
              {postingComment ? "..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
  )
} 