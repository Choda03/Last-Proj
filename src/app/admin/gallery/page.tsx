"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { Search, Filter, Check, X } from "lucide-react"
import Image from "next/image"
import { IArtwork } from "@/models/Artwork"
import { Types } from "mongoose"

interface Artist {
  _id: string
  name: string
  email: string
}

interface ArtworkWithArtist extends Omit<IArtwork, "artist"> {
  artist: Artist
  _id: string
}

import React from "react"

export default function ArtworkModeration() {
  const { isAdmin, isLoading } = useAuth(true, true)
  const [artworks, setArtworks] = useState<ArtworkWithArtist[]>([])
  const [filteredArtworks, setFilteredArtworks] = useState<ArtworkWithArtist[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "painting" | "photography" | "digital" | "sculpture" | "other">("all")
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true)

  // Like state
  const [liking, setLiking] = useState<string | null>(null)
  // Comment modal state
  const [commentModal, setCommentModal] = useState<{ open: boolean; artwork: ArtworkWithArtist | null }>({ open: false, artwork: null })
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loadingComments, setLoadingComments] = useState(false)
  const [postingComment, setPostingComment] = useState(false)

  useEffect(() => {
    fetchArtworks()
  }, [])

  useEffect(() => {
    let filtered = [...artworks]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        artwork =>
          artwork.title.toLowerCase().includes(query) ||
          artwork.description.toLowerCase().includes(query) ||
          artwork.artist.name.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(artwork => artwork.status === statusFilter)
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(artwork => artwork.category === categoryFilter)
    }

    setFilteredArtworks(filtered)
  }, [artworks, searchQuery, statusFilter, categoryFilter])

  const fetchArtworks = async () => {
    try {
      const res = await fetch("/api/admin/artworks")
      if (!res.ok) throw new Error("Failed to fetch artworks")
      const data = await res.json()
      setArtworks(data as ArtworkWithArtist[])
      setFilteredArtworks(data as ArtworkWithArtist[])
    } catch (error) {
      console.error("Error fetching artworks:", error)
      toast.error("Failed to load artworks")
    } finally {
      setIsLoadingArtworks(false)
    }
  }

  // This function is called when the admin clicks the Approve or Reject button for an artwork
  // It updates the status of the artwork ("approved" or "rejected") in the backend and updates the UI
  const handleUpdateStatus = async (artworkId: string, newStatus: "approved" | "rejected") => {
    try {
      // Send a PATCH request to the backend API to update the status of the artwork
      // The artworkId is sent as a query parameter, and the new status is sent in the request body
      const res = await fetch(`/api/admin/artworks?artworkId=${artworkId}`, {
        method: "PATCH", // Use PATCH to update only the status field
        headers: { "Content-Type": "application/json" }, // Specify JSON content type
        body: JSON.stringify({ status: newStatus }), // Send the new status ("approved" or "rejected")
      })

      // If the response is not OK, throw an error to be caught below
      if (!res.ok) throw new Error("Failed to update artwork status")

      // Parse the updated artwork returned from the backend
      const updatedArtwork = await res.json()

      // Update the local artworks state: replace the old artwork with the updated one
      setArtworks(artworks.map(artwork =>
        artwork._id === artworkId ? updatedArtwork : artwork
      ))

      // Show a success message to the admin
      toast.success(`Artwork ${newStatus} successfully`)
    } catch (error) {
      // If there was an error, log it and show an error message
      console.error("Error updating artwork status:", error)
      toast.error("Failed to update artwork status")
    }
  }

  const handleDeleteArtwork = async (artworkId: string) => {
    try {
      const res = await fetch(`/api/admin/artworks?artworkId=${artworkId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete artwork")

      setArtworks(artworks.filter(artwork => artwork._id !== artworkId))
      toast.success("Artwork deleted successfully")
    } catch (error) {
      console.error("Error deleting artwork:", error)
      toast.error("Failed to delete artwork")
    }
  }

  // Like handler
  const handleLike = async (artworkId: string) => {
    setLiking(artworkId)
    try {
      const res = await fetch(`/api/artworks/${artworkId}/like`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to like artwork")
      const data = await res.json()
      setArtworks((prev) => prev.map((a) => a._id === artworkId ? { ...a, likes: Array(data.likes).fill("") } : a))
      toast.success(data.liked ? "Liked!" : "Unliked!")
    } catch (err) {
      toast.error("Failed to like artwork")
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
  const openCommentModal = async (artwork: ArtworkWithArtist) => {
    setCommentModal({ open: true, artwork })
    setLoadingComments(true)
    try {
      const res = await fetch(`/api/artworks/${artwork._id}/comments`)
      if (!res.ok) throw new Error("Failed to fetch comments")
      const data = await res.json()
      setComments(data.comments)
    } catch (err) {
      setComments([])
      toast.error("Failed to load comments")
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
      toast.success("Comment added!")
    } catch (err) {
      toast.error("Failed to add comment")
    } finally {
      setPostingComment(false)
    }
  }

  if (isLoading || isLoadingArtworks) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Artwork Moderation</h1>
          <p className="text-muted-foreground">
            Review and manage submitted artworks
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search artworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value: "all" | "pending" | "approved" | "rejected") => setStatusFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={categoryFilter}
                onValueChange={(value: "all" | "painting" | "photography" | "digital" | "sculpture" | "other") => setCategoryFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="sculpture">Sculpture</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artworks ({filteredArtworks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork._id.toString()}
                className="border rounded-lg overflow-hidden"
              >
                <div className="relative aspect-square">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-medium">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      by {artwork.artist?.name || "Unknown Artist"}
                    </p>
                    <p className="text-sm mt-2 line-clamp-2">
                      {artwork.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      artwork.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : artwork.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {artwork.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      {/* LIKE BUTTON */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLike(artwork._id.toString())}
                        aria-label="Like"
                      >
                        <span role="img" aria-label="like">❤️</span> {artwork.likes?.length || 0}
                      </Button>
                      {/* COMMENT BUTTON */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openCommentModal(artwork)}
                        aria-label="Comments"
                      >
                        💬
                      </Button>
                      {/* DOWNLOAD BUTTON */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(artwork.imageUrl, artwork.title)}
                        aria-label="Download"
                      >
                        ⬇️
                      </Button>
                      {artwork.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleUpdateStatus(artwork._id.toString(), "approved")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleUpdateStatus(artwork._id.toString(), "rejected")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteArtwork(artwork._id.toString())}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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