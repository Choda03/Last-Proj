import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth(requireAuth = true, requireAdmin = false) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && status === "unauthenticated") {
      router.push("/login")
    }

    if (requireAdmin && session?.user?.role !== "admin") {
      router.push("/")
    }
  }, [session, status, requireAuth, requireAdmin, router])

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isAdmin: session?.user?.role === "admin",
    isLoading: status === "loading"
  }
} 