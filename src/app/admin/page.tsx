"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { Users, Image as ImageIcon, BarChart, MessageSquare, Settings, Loader2, AlertCircle } from "lucide-react"

// Types
interface DashboardStats {
  totalUsers: number
  totalArtworks: number
  totalViews: number
  activeUsers: number
}

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface Artwork {
  id: string
  title: string
  description: string
  url: string
  userId: string
  createdAt: string
}

interface Message {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

type TabType = 'dashboard' | 'users' | 'gallery' | 'messages' | 'settings'

export default function AdminDashboard() {
  const router = useRouter()
  const { isAdmin, isLoading: isAuthLoading, isAuthorized } = useAuth(true, true)
  
  // State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalArtworks: 0,
    totalViews: 0,
    activeUsers: 0,
  })
  const [users, setUsers] = useState<User[]>([])
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  // Fetch data when authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthorized) {
      fetchDashboardData()
    }
  }, [isAuthLoading, isAuthorized])

  const fetchDashboardData = async () => {
    if (!isAdmin) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch all data in parallel
      const [statsRes, usersRes, artworksRes, messagesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/artworks'),
        fetch('/api/admin/messages')
      ])

      // Check for errors
      if (!statsRes.ok || !usersRes.ok || !artworksRes.ok || !messagesRes.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      // Parse responses
      const [statsData, usersData, artworksData, messagesData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        artworksRes.json(),
        messagesRes.json()
      ])

      // Update state
      setStats(statsData)
      setUsers(usersData)
      setArtworks(artworksData)
      setMessages(messagesData)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      console.error('Error fetching dashboard data:', errorMessage)
      setError(errorMessage)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authorized
  if (!isAuthorized || !isAdmin) {
    router.push('/')
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your application content and users</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <Tabs defaultValue="dashboard" onValueChange={(value) => setActiveTab(value as TabType)}>
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Gallery</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Artworks</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalArtworks}</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">+5.4% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Add more TabsContent for users, gallery, messages, settings as needed */}
      </Tabs>
    </div>
  )
}