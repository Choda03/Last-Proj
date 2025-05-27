// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useAuth } from "@/hooks/useAuth"
// import { toast } from "sonner"
// import { Users, Image as ImageIcon, BarChart, MessageSquare, Settings, Loader2, AlertCircle } from "lucide-react"

// // Types
// interface DashboardStats {
//   totalUsers: number
//   totalArtworks: number
//   totalViews: number
//   activeUsers: number
// }

// interface User {
//   id: string
//   name: string
//   email: string
//   role: string
//   createdAt: string
// }

// interface Artwork {
//   id: string
//   title: string
//   description: string
//   url: string
//   userId: string
//   createdAt: string
// }

// interface Message {
//   id: string
//   name: string
//   email: string
//   message: string
//   createdAt: string
// }

// type TabType = 'dashboard' | 'users' | 'gallery' | 'messages' | 'settings'

// export default function AdminDashboard() {
//   const router = useRouter()
//   const { isAdmin, isLoading: isAuthLoading, isAuthorized } = useAuth(true, true)
  
//   // State
//   const [activeTab, setActiveTab] = useState<TabType>('dashboard')
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [stats, setStats] = useState<DashboardStats>({
//     totalUsers: 0,
//     totalArtworks: 0,
//     totalViews: 0,
//     activeUsers: 0,
//   })
//   const [users, setUsers] = useState<User[]>([])
//   const [artworks, setArtworks] = useState<Artwork[]>([])
//   const [messages, setMessages] = useState<Message[]>([])

//   // Fetch data when authenticated
//   useEffect(() => {
//     if (!isAuthLoading && isAuthorized) {
//       fetchDashboardData()
//     }
//   }, [isAuthLoading, isAuthorized])

//   const fetchDashboardData = async () => {
//     if (!isAdmin) return
    
//     setIsLoading(true)
//     setError(null)
    
//     try {
//       // Fetch all data in parallel
//       const [statsRes, usersRes, artworksRes, messagesRes] = await Promise.all([
//         fetch('/api/admin/stats'),
//         fetch('/api/admin/users'),
//         fetch('/api/admin/artworks'),
//         fetch('/api/admin/messages')
//       ])

//       // Check for errors
//       if (!statsRes.ok || !usersRes.ok || !artworksRes.ok || !messagesRes.ok) {
//         throw new Error('Failed to fetch dashboard data')
//       }

//       // Parse responses
//       const [statsData, usersData, artworksData, messagesData] = await Promise.all([
//         statsRes.json(),
//         usersRes.json(),
//         artworksRes.json(),
//         messagesRes.json()
//       ])

//       // Update state
//       setStats(statsData)
//       setUsers(usersData)
//       setArtworks(artworksData)
//       setMessages(messagesData)
      
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
//       console.error('Error fetching dashboard data:', errorMessage)
//       setError(errorMessage)
//       toast.error('Failed to load dashboard data')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Show loading state
//   if (isAuthLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="w-8 h-8 animate-spin" />
//           <p>Loading admin dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   // Redirect if not authorized
//   if (!isAuthorized || !isAdmin) {
//     router.push('/')
//     return null
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <p className="text-muted-foreground">Manage your application content and users</p>
//       </header>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
//           <AlertCircle className="w-5 h-5" />
//           <span>{error}</span>
//         </div>
//       )}

//       <Tabs defaultValue="dashboard" onValueChange={(value) => setActiveTab(value as TabType)}>
//         <TabsList className="mb-6">
//           <TabsTrigger value="dashboard" className="flex items-center gap-2">
//             <BarChart className="w-4 h-4" />
//             <span>Dashboard</span>
//           </TabsTrigger>
//           <TabsTrigger value="users" className="flex items-center gap-2">
//             <Users className="w-4 h-4" />
//             <span>Users</span>
//           </TabsTrigger>
//           <TabsTrigger value="gallery" className="flex items-center gap-2">
//             <ImageIcon className="w-4 h-4" />
//             <span>Gallery</span>
//           </TabsTrigger>
//           <TabsTrigger value="messages" className="flex items-center gap-2">
//             <MessageSquare className="w-4 h-4" />
//             <span>Messages</span>
//           </TabsTrigger>
//           <TabsTrigger value="settings" className="flex items-center gap-2">
//             <Settings className="w-4 h-4" />
//             <span>Settings</span>
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="dashboard">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//                 <Users className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stats.totalUsers}</div>
//                 <p className="text-xs text-muted-foreground">+20.1% from last month</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Artworks</CardTitle>
//                 <ImageIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stats.totalArtworks}</div>
//                 <p className="text-xs text-muted-foreground">+180.1% from last month</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Views</CardTitle>
//                 <BarChart className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stats.totalViews}</div>
//                 <p className="text-xs text-muted-foreground">+19% from last month</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Active Now</CardTitle>
//                 <Users className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stats.activeUsers}</div>
//                 <p className="text-xs text-muted-foreground">+5 since last hour</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="users">
//           <Card>
//             <CardHeader>
//               <CardTitle>Users</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div>Loading users...</div>
//               ) : (
//                 <div className="space-y-4">
//                   {users.map((user) => (
//                     <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div>
//                         <p className="font-medium">{user.name}</p>
//                         <p className="text-sm text-muted-foreground">{user.email}</p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className={`px-2 py-1 text-xs rounded-full ${
//                           user.role === 'admin' 
//                             ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' 
//                             : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
//                         }`}>
//                           {user.role}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="gallery">
//           <Card>
//             <CardHeader>
//               <CardTitle>Artwork Gallery</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div>Loading artworks...</div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {artworks.map((artwork) => (
//                     <div key={artwork.id} className="border rounded-lg overflow-hidden">
//                       <div className="aspect-square bg-muted relative">
//                         <img
//                           src={artwork.url}
//                           alt={artwork.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="p-4">
//                         <h3 className="font-medium">{artwork.title}</h3>
//                         <p className="text-sm text-muted-foreground line-clamp-2">
//                           {artwork.description}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="messages">
//           <Card>
//             <CardHeader>
//               <CardTitle>Messages</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div>Loading messages...</div>
//               ) : (
//                 <div className="space-y-4">
//                   {messages.map((message) => (
//                     <div key={message.id} className="border rounded-lg p-4">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <p className="font-medium">{message.name}</p>
//                           <p className="text-sm text-muted-foreground">{message.email}</p>
//                         </div>
//                         <time className="text-xs text-muted-foreground">
//                           {new Date(message.createdAt).toLocaleDateString()}
//                         </time>
//                       </div>
//                       <p className="mt-2">{message.message}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="settings">
//           <Card>
//             <CardHeader>
//               <CardTitle>Settings</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground">
//                 Application settings will be available here.
//               </p>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
