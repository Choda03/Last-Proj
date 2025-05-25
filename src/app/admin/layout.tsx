import { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/sidebar"

export const metadata: Metadata = {
  title: "Admin Dashboard | GalleryHub",
  description: "Manage your GalleryHub platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
} 