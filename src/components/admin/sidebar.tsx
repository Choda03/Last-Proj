"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  Image as ImageIcon,
  Settings,
  BarChart,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { ConfirmModal } from "@/components/ui/ConfirmModal"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [showSignOutModal, setShowSignOutModal] = useState(false)

  const confirmSignOut = async () => {
    setShowSignOutModal(false)
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center space-x-2">
          <span className="text-lg font-semibold">GalleryHub Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <button
          onClick={() => setShowSignOutModal(true)}
          className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
      <ConfirmModal
        open={showSignOutModal}
        title="Sign out?"
        description="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={confirmSignOut}
        onCancel={() => setShowSignOutModal(false)}
      />
    </div>
  )
} 