"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  User, 
  Palette, 
  Download,
  Upload,
  Trash2,
  Shield,
  Settings as SettingsIcon
} from "lucide-react"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface UserSettings {
  displayName: string
  email: string
  notifications: {
    calendar: boolean
    tasks: boolean
    notes: boolean
    desktop: boolean
    sound: boolean
  }
  privacy: {
    shareByDefault: boolean
    allowNotifications: boolean
  }
  appearance: {
    compactView: boolean
    showCompletedTasks: boolean
    defaultView: 'home' | 'calendar' | 'notes' | 'tasks'
  }
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<UserSettings>({
    displayName: "",
    email: "",
    notifications: {
      calendar: true,
      tasks: true,
      notes: false,
      desktop: true,
      sound: false
    },
    privacy: {
      shareByDefault: false,
      allowNotifications: true
    },
    appearance: {
      compactView: false,
      showCompletedTasks: true,
      defaultView: 'home'
    }
  })
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [exportData, setExportData] = useState("")
  const [importData, setImportData] = useState("")

  useEffect(() => {
    const savedSettings = localStorage.getItem("user-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Request notification permission if enabled
    if ('Notification' in window && settings.notifications.desktop) {
      Notification.requestPermission()
    }
  }, [])

  const saveSettings = (updatedSettings: UserSettings) => {
    setSettings(updatedSettings)
    localStorage.setItem("user-settings", JSON.stringify(updatedSettings))
  }

  const handleExportData = () => {
    const allData = {
      settings,
      notes: localStorage.getItem("notes"),
      folders: localStorage.getItem("folders"),
      tasks: localStorage.getItem("tasks"),
      taskLists: localStorage.getItem("task-lists"),
      calendarEvents: localStorage.getItem("calendar-events"),
      stickyNote: localStorage.getItem("sticky-note"),
      exportDate: new Date().toISOString()
    }
    setExportData(JSON.stringify(allData, null, 2))
    setIsExportDialogOpen(true)
  }

  const handleImportData = () => {
    try {
      const data = JSON.parse(importData)
      
      if (data.settings) {
        localStorage.setItem("user-settings", data.settings)
        setSettings(JSON.parse(data.settings))
      }
      if (data.notes) localStorage.setItem("notes", data.notes)
      if (data.folders) localStorage.setItem("folders", data.folders)
      if (data.tasks) localStorage.setItem("tasks", data.tasks)
      if (data.taskLists) localStorage.setItem("task-lists", data.taskLists)
      if (data.calendarEvents) localStorage.setItem("calendar-events", data.calendarEvents)
      if (data.stickyNote) localStorage.setItem("sticky-note", data.stickyNote)
      
      setImportData("")
      setIsImportDialogOpen(false)
      
      // Reload page to reflect changes
      window.location.reload()
    } catch (error) {
      alert("Invalid import data format")
    }
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const downloadExportFile = () => {
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `familyhub-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your FamilyHub experience and manage your data
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={settings.displayName}
                onChange={(e) => saveSettings({...settings, displayName: e.target.value})}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => saveSettings({...settings, email: e.target.value})}
                placeholder="Enter your email"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="defaultView">Default View</Label>
              <Select 
                value={settings.appearance.defaultView} 
                onValueChange={(value: any) => saveSettings({
                  ...settings, 
                  appearance: {...settings.appearance, defaultView: value}
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                  <SelectItem value="tasks">Tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compactView">Compact View</Label>
                <p className="text-sm text-muted-foreground">Use smaller spacing and text</p>
              </div>
              <Switch
                id="compactView"
                checked={settings.appearance.compactView}
                onCheckedChange={(checked) => saveSettings({
                  ...settings,
                  appearance: {...settings.appearance, compactView: checked}
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showCompleted">Show Completed Tasks</Label>
                <p className="text-sm text-muted-foreground">Display completed tasks by default</p>
              </div>
              <Switch
                id="showCompleted"
                checked={settings.appearance.showCompletedTasks}
                onCheckedChange={(checked) => saveSettings({
                  ...settings,
                  appearance: {...settings.appearance, showCompletedTasks: checked}
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="calendarNotifications">Calendar Events</Label>
                <p className="text-sm text-muted-foreground">Get notified about upcoming events</p>
              </div>
              <Switch
                id="calendarNotifications"
                checked={settings.notifications.calendar}
                onCheckedChange={(checked) => saveSettings({
                  ...settings,
                  notifications: {...settings.notifications, calendar: checked}
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="taskNotifications">Task Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about due tasks</p>
              </div>
              <Switch
                id="taskNotifications"
                checked={settings.notifications.tasks}
                onCheckedChange={(checked) => saveSettings({
                  ...settings,
                  notifications: {...settings.notifications, tasks: checked}
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="noteNotifications">Note Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified when notes are shared</p>
              </div>
              <Switch
                id="noteNotifications"
                checked={settings.notifications.notes}
                onCheckedChange={(checked) => saveSettings({
                  ...settings,
                  notifications: {...settings.notifications, notes: checked}
                })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="desktopNotifications">Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">Show browser notifications</p>
              </div>
              <Switch
                id="desktopNotifications"
                checked={settings.notifications.desktop}
                onCheckedChange={(checked) => {
                  if (checked && 'Notification' in window) {
                    Notification.requestPermission()
                  }
                  saveSettings({
                    ...settings,
                    notifications: {...settings.notifications, desktop: checked}
                  })
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="soundNotifications">Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">Play sound for notifications</p>
              </div>
              <Switch
                id="soundNotifications"
                checked={settings.notifications.sound}
                onCheckedChange={(checked) => saveSettings({
                  ...settings,
                  notifications: {...settings.notifications, sound: checked}
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="shareByDefault">Share Notes by Default</Label>
                <p className="text-sm text-muted-foreground">New notes are shared with family by default</p>
              </div>
              <Switch
                id="shareByDefault"
                checked={settings.privacy.shareByDefault}
                onCheckedChange={(checked) => saveSettings({
                  ...settings,
                  privacy: {...settings.privacy, shareByDefault: checked}
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowNotifications">Allow Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable all notification features</p>
              </div>
              <Switch
                id="allowNotifications"
                checked={settings.privacy.allowNotifications}
                onCheckedChange={(checked) => saveSettings({
                  ...settings,
                  privacy: {...settings.privacy, allowNotifications: checked}
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleExportData} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 overflow-y-auto">
                    <p className="text-sm text-muted-foreground">
                      Your data has been exported. You can copy it or download as a file.
                    </p>
                    <Textarea
                      value={exportData}
                      readOnly
                      rows={15}
                      className="font-mono text-xs"
                    />
                    <div className="flex gap-2">
                      <Button onClick={downloadExportFile} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download File
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigator.clipboard.writeText(exportData)}
                      >
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Paste your exported data below. This will overwrite existing data.
                    </p>
                    <Textarea
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Paste your exported data here..."
                      rows={10}
                      className="font-mono text-xs"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleImportData} className="flex-1">
                        Import Data
                      </Button>
                      <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="destructive" onClick={handleClearAllData} className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("notes") || "[]").length : 0}
                </div>
                <div className="text-sm text-muted-foreground">Notes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("tasks") || "[]").length : 0}
                </div>
                <div className="text-sm text-muted-foreground">Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("calendar-events") || "[]").length : 0}
                </div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>About FamilyHub</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium">Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li>• Calendar with event management</li>
                  <li>• Markdown notes with linking</li>
                  <li>• Multiple task lists</li>
                  <li>• Dark mode support</li>
                  <li>• Mobile-first design</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Technology</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">Next.js 14</Badge>
                  <Badge variant="secondary">React 18</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">shadcn/ui</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}