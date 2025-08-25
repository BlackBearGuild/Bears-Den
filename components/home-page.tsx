"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, CheckSquare, Clock, StickyNote } from "lucide-react"
import Link from "next/link"

interface RecentUpdate {
  id: string
  type: 'calendar' | 'note' | 'task'
  title: string
  description: string
  timestamp: Date
}

export function HomePage() {
  const [stickyNote, setStickyNote] = useState("")
  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([])

  useEffect(() => {
    const savedNote = localStorage.getItem("sticky-note")
    if (savedNote) {
      setStickyNote(savedNote)
    }

    const updates: RecentUpdate[] = [
      {
        id: "1",
        type: "calendar",
        title: "Team Meeting",
        description: "Weekly family planning session",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: "2", 
        type: "task",
        title: "Grocery Shopping",
        description: "Buy ingredients for weekend dinner",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: "3",
        type: "note",
        title: "Vacation Planning",
        description: "Research destinations for summer trip",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
      }
    ]
    setRecentUpdates(updates)
  }, [])

  const handleStickyNoteChange = (value: string) => {
    setStickyNote(value)
    localStorage.setItem("sticky-note", value)
  }

  const getIcon = (type: RecentUpdate['type']) => {
    switch (type) {
      case 'calendar':
        return <Calendar className="h-4 w-4" />
      case 'note':
        return <FileText className="h-4 w-4" />
      case 'task':
        return <CheckSquare className="h-4 w-4" />
    }
  }

  const getBadgeVariant = (type: RecentUpdate['type']) => {
    switch (type) {
      case 'calendar':
        return 'default'
      case 'note':
        return 'secondary'
      case 'task':
        return 'outline'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours === 1) return '1 hour ago'
    return `${hours} hours ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to FamilyHub</h1>
        <p className="text-muted-foreground">
          Keep your family organized with calendar events, notes, and tasks all in one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUpdates.map((update) => (
                  <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="mt-1">
                      {getIcon(update.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{update.title}</h4>
                        <Badge variant={getBadgeVariant(update.type)} className="text-xs">
                          {update.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {update.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(update.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {recentUpdates.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent updates yet</p>
                    <p className="text-sm">Start by creating a calendar event, note, or task!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Quick Note
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Jot down a quick note..."
              value={stickyNote}
              onChange={(e) => handleStickyNoteChange(e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/calendar">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Calendar</h3>
                  <p className="text-sm text-muted-foreground">Manage events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/notes">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Notes</h3>
                  <p className="text-sm text-muted-foreground">Take notes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tasks">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CheckSquare className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Tasks</h3>
                  <p className="text-sm text-muted-foreground">Manage todos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <StickyNote className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Settings</h3>
                  <p className="text-sm text-muted-foreground">Customize app</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}