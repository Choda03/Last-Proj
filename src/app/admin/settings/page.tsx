"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { Save } from "lucide-react"

interface PlatformSettings {
  allowNewRegistrations: boolean
  requireEmailVerification: boolean
  allowArtworkUploads: boolean
  requireArtworkApproval: boolean
  maxArtworksPerUser: number
  maxFileSizeMB: number
  allowedFileTypes: string[]
  maintenanceMode: boolean
  maintenanceMessage: string
}

export default function AdminSettings() {
  const { isAdmin, isLoading } = useAuth(true, true)
  const [settings, setSettings] = useState<PlatformSettings>({
    allowNewRegistrations: true,
    requireEmailVerification: true,
    allowArtworkUploads: true,
    requireArtworkApproval: true,
    maxArtworksPerUser: 50,
    maxFileSizeMB: 10,
    allowedFileTypes: ["image/jpeg", "image/png", "image/gif"],
    maintenanceMode: false,
    maintenanceMessage: "GalleryHub is currently under maintenance. Please check back later.",
  })
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings")
      if (!res.ok) throw new Error("Failed to fetch settings")
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!res.ok) throw new Error("Failed to save settings")

      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || isLoadingSettings) {
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
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">
            Configure your GalleryHub platform
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="allowNewRegistrations">Allow New Registrations</Label>
              <Switch
                id="allowNewRegistrations"
                checked={settings.allowNewRegistrations}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, allowNewRegistrations: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
              <Switch
                id="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, requireEmailVerification: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Artwork Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="allowArtworkUploads">Allow Artwork Uploads</Label>
              <Switch
                id="allowArtworkUploads"
                checked={settings.allowArtworkUploads}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, allowArtworkUploads: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="requireArtworkApproval">Require Artwork Approval</Label>
              <Switch
                id="requireArtworkApproval"
                checked={settings.requireArtworkApproval}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, requireArtworkApproval: checked })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxArtworksPerUser">Max Artworks Per User</Label>
              <Input
                id="maxArtworksPerUser"
                type="number"
                value={settings.maxArtworksPerUser}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxArtworksPerUser: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Upload Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSizeMB">Max File Size (MB)</Label>
              <Input
                id="maxFileSizeMB"
                type="number"
                value={settings.maxFileSizeMB}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxFileSizeMB: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                value={settings.allowedFileTypes.join(", ")}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowedFileTypes: e.target.value.split(",").map((type) => type.trim()),
                  })
                }
                placeholder="image/jpeg, image/png, image/gif"
              />
              <p className="text-sm text-muted-foreground">
                Comma-separated list of MIME types
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
              <Input
                id="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMessage: e.target.value })
                }
                placeholder="Enter maintenance message..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 