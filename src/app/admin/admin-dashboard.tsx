"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Users, 
  Image as ImageIcon, 
  BarChart, 
  MessageSquare, 
  Settings, 
  Loader2, 
  AlertCircle,
  Eye,
  TrendingUp,
  UserPlus,
  ImagePlus
} from "lucide-react";

// Types
interface DashboardStats {
  totalUsers: number;
  totalArtworks: number;
  totalViews: number;
  activeUsers: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

interface Artwork {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  userId: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Default stats
const DEFAULT_STATS: DashboardStats = {
  totalUsers: 0,
  totalArtworks: 0,
  totalViews: 0,
  activeUsers: 0
};

// Skeleton loader for stats cards
const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-6 rounded-full" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-32 mt-2" />
    </CardContent>
  </Card>
);

// Stat card component
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, description, icon, className = '' }: StatCardProps) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="h-6 w-6 text-muted-foreground">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [users, setUsers] = useState<User[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Use the useAuth hook to check authentication and admin status
  const { isAdmin, isLoading: isAuthLoading, isAuthorized, session } = useAuth(true, true);

  // Fetch data when authorized and admin
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthorized || !isAdmin) return;

      setIsLoading(true);
      setError(null);

      try {
        const [statsRes, usersRes, artworksRes, messagesRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/users'),
          fetch('/api/admin/artworks'),
          fetch('/api/admin/messages')
        ]);

        if (!statsRes.ok || !usersRes.ok || !artworksRes.ok || !messagesRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [statsData, usersData, artworksData, messagesData] = await Promise.all([
          statsRes.json(),
          usersRes.json(),
          artworksRes.json(),
          messagesRes.json()
        ]);

        setStats(statsData);
        setUsers(usersData);
        setArtworks(artworksData);
        setMessages(messagesData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthorized, isAdmin]);

  // Show loading state while checking auth
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  // Redirect if not admin (after auth loading is complete)
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {session?.user?.email}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              router.push('/api/auth/signout');
              toast.success('Signed out successfully');
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            description="+20.1% from last month"
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Total Artworks"
            value={stats.totalArtworks}
            description="+12.5% from last month"
            icon={<ImageIcon className="h-4 w-4" />}
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            description="+180.1% from last month"
            icon={<Eye className="h-4 w-4" />}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            description="+19% from last month"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>
      )}

      {/* Tabs */}
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Recent activity and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Dashboard content coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <Button size="sm" onClick={() => router.push('/admin/users/new')}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Users management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gallery</CardTitle>
                <CardDescription>Manage artworks and media</CardDescription>
              </div>
              <Button size="sm" onClick={() => router.push('/admin/artworks/upload')}>
                <ImagePlus className="mr-2 h-4 w-4" />
                Upload Artwork
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Gallery management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>View and respond to user messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Messages management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Settings management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;