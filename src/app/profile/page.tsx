"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Mail, Shield, Calendar } from "lucide-react"
import { Playfair_Display } from "next/font/google"
import { FormField } from "@/components/ui/form"
import { toast } from "sonner"
import type { IArtwork } from "@/models/Artwork"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "painting",
    tags: "",
    image: null as File | null,
  })
  const [artworks, setArtworks] = useState<IArtwork[]>([])
  const [loadingArtworks, setLoadingArtworks] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch(`/api/artworks?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setArtworks(data))
        .catch(() => toast.error("Failed to load your images"))
        .finally(() => setLoadingArtworks(false))
    }
  }, [status, session?.user?.id])

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setForm({ ...form, image: (e.target as HTMLInputElement).files?.[0] || null });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("tags", form.tags);
      if (form.image) formData.append("image", form.image);
      const res = await fetch("/api/artworks", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      toast.success("Image uploaded successfully! Redirecting to gallery...");
      setForm({ title: "", description: "", category: "painting", tags: "", image: null });
      router.push("/gallery");
    } catch (error: any) {
      toast.error((error as Error).message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div>
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <UserCircle className="w-16 h-16 text-primary" />
              )}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div className="font-semibold">Name:</div>
              <div>{session.user.name}</div>
              <div className="font-semibold">Email:</div>
              <div>{session.user.email}</div>
              <div className="font-semibold">Role:</div>
              <div>{session.user.role === "admin" ? "Admin" : "User"}</div>
              <div className="font-semibold">Email Verified:</div>
              <div>{session.user.emailVerified ? "Yes" : "No"}</div>
              <div className="font-semibold">Member Since:</div>
              <div>{session.user.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : "-"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="image">Image File</label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="painting">Painting</option>
                <option value="photography">Photography</option>
                <option value="digital">Digital</option>
                <option value="sculpture">Sculpture</option>
                <option value="other">Other</option>
              </select>
            </div>
            <FormField
              label="Tags (comma separated)"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. abstract, modern, colorful"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Uploaded Images</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingArtworks ? (
            <div>Loading your images...</div>
          ) : artworks.length === 0 ? (
            <div>You have not uploaded any images yet.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {artworks.map((art) => (
                <div
                  key={String(art._id)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border p-2 flex flex-col"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{art.title}</div>
                    <div className="text-xs text-muted-foreground mb-1">{art.category}</div>
                    <div className="text-sm mb-1">{art.description}</div>
                    {art.tags && art.tags.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-semibold">Tags:</span> {art.tags.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 