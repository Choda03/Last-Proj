import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"

interface UserSession {
  id: string
  name?: string | null
  email?: string | null
  role?: string
  image?: string | null
  emailVerified?: boolean | null
}

interface Session {
  user: UserSession
  expires: string
}

export function useAuth(requireAuth = true, requireAdmin = false) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Only run auth logic after session is done loading
    if (status === 'loading') return;

    // If authentication is required but user is not authenticated
    if (requireAuth && status !== 'authenticated') {
      const callbackUrl = encodeURIComponent(pathname || '/');
      router.push(`/login?callbackUrl=${callbackUrl}`);
      setIsAuthorized(false);
      setIsCheckingAuth(false);
      return;
    }

    // If authenticated, check admin if required
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any)?.role;
      const adminStatus = userRole === 'admin';
      setIsAdmin(adminStatus);
      if (requireAdmin && !adminStatus) {
        router.push('/');
        setIsAuthorized(false);
        setIsCheckingAuth(false);
        return;
      }
      setIsAuthorized(true);
    }
    setIsCheckingAuth(false);
  }, [status, session, requireAuth, requireAdmin, pathname, router]);

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isAdmin,
    isLoading: status === 'loading' || isCheckingAuth,
    isAuthorized,
  };
}