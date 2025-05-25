"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import Image from "next/image"
import { Users, Image as ImageIcon, Eye, TrendingUp } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface Image {
  id: string
  title: string
  description: string
  url: string
  userId: string
  createdAt: string
}

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

interface DashboardStats {
  totalUsers: number
  totalArtworks: number
  totalViews: number
  activeUsers: number
}

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAuth(true, true)
  const [users, setUsers] = useState<User[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalArtworks: 0,
    totalViews: 0,
    activeUsers: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await fetch("/api/admin/users")
        if (!usersRes.ok) throw new Error("Failed to fetch users")
        const usersData = await usersRes.json()
        setUsers(usersData)

        // Fetch images
        const imagesRes = await fetch("/api/admin/images")
        if (!imagesRes.ok) throw new Error("Failed to fetch images")
        const imagesData = await imagesRes.json()
        setImages(imagesData)

        // Fetch messages
        const messagesRes = await fetch("/api/admin/messages")
        if (!messagesRes.ok) throw new Error("Failed to fetch messages")
        const messagesData = await messagesRes.json()
        setMessages(messagesData)
      } catch (error) {
        console.error("Error fetching admin data:", error)
        toast.error("Failed to load admin data")
      } finally {
        setIsDataLoading(false)
      }
    }

    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats")
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [])

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete user")
      setUsers(users.filter(user => user.id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      const res = await fetch(`/api/admin/images?imageId=${imageId}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete image")
      setImages(images.filter(image => image.id !== imageId))
      toast.success("Image deleted successfully")
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error("Failed to delete image")
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res = await fetch(`/api/admin/messages?messageId=${messageId}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete message")
      setMessages(messages.filter(message => message.id !== messageId))
      toast.success("Message deleted successfully")
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Failed to delete message")
    }
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Total Artworks",
      value: stats.totalArtworks,
      icon: ImageIcon,
      description: "Uploaded artworks",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      description: "Gallery views",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: TrendingUp,
      description: "Users this month",
    },
  ]

  if (isLoading || isDataLoading) {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your GalleryHub platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add recent activity list here */}
              <p className="text-sm text-muted-foreground">
                Loading recent activity...
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Add New User
              </button>
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Review Artworks
              </button>
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                View Reports
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Role: {user.role}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Image Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={image.url}
                        alt={image.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{image.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {image.description}
                      </p>
                      <Button
                        variant="destructive"
                        className="mt-2"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{message.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {message.email}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 