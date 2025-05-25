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

export default function ArtworkModeration() {
  const { isAdmin, isLoading } = useAuth(true, true)
  const [artworks, setArtworks] = useState<ArtworkWithArtist[]>([])
  const [filteredArtworks, setFilteredArtworks] = useState<ArtworkWithArtist[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "painting" | "photography" | "digital" | "sculpture" | "other">("all")
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true)

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

  const handleUpdateStatus = async (artworkId: string, newStatus: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/artworks?artworkId=${artworkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update artwork status")

      const updatedArtwork = await res.json()
      setArtworks(artworks.map(artwork =>
        artwork._id === artworkId ? updatedArtwork : artwork
      ))
      toast.success(`Artwork ${newStatus} successfully`)
    } catch (error) {
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
                      by {artwork.artist.name}
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
    </div>
  )
} 