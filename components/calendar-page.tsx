"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, MapPin, Trash2, Edit, Bell } from "lucide-react"
import { format, isSameDay, startOfDay, endOfDay, isToday, isTomorrow } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: Date
  time: string
  location?: string
  color: string
  notifications: boolean
}

const eventColors = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
]

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    time: "",
    location: "",
    color: "blue",
    notifications: true
  })

  useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events")
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }))
      setEvents(parsedEvents)
    }
  }, [])

  const saveEvents = (updatedEvents: CalendarEvent[]) => {
    setEvents(updatedEvents)
    localStorage.setItem("calendar-events", JSON.stringify(updatedEvents))
  }

  const handleCreateEvent = () => {
    if (!newEvent.title || !selectedDate) return

    const event: CalendarEvent = {
      id: uuidv4(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      time: newEvent.time,
      location: newEvent.location,
      color: newEvent.color,
      notifications: newEvent.notifications
    }

    saveEvents([...events, event])
    setNewEvent({
      title: "",
      description: "",
      time: "",
      location: "",
      color: "blue",
      notifications: true
    })
    setIsDialogOpen(false)

    if (event.notifications) {
      scheduleNotification(event)
    }
  }

  const handleEditEvent = () => {
    if (!editingEvent || !newEvent.title) return

    const updatedEvents = events.map(event => 
      event.id === editingEvent.id 
        ? { ...editingEvent, ...newEvent, date: selectedDate || editingEvent.date }
        : event
    )

    saveEvents(updatedEvents)
    setEditingEvent(null)
    setNewEvent({
      title: "",
      description: "",
      time: "",
      location: "",
      color: "blue",
      notifications: true
    })
    setIsDialogOpen(false)
  }

  const handleDeleteEvent = (eventId: string) => {
    saveEvents(events.filter(event => event.id !== eventId))
  }

  const openEditDialog = (event: CalendarEvent) => {
    setEditingEvent(event)
    setSelectedDate(event.date)
    setNewEvent({
      title: event.title,
      description: event.description || "",
      time: event.time,
      location: event.location || "",
      color: event.color,
      notifications: event.notifications
    })
    setIsDialogOpen(true)
  }

  const scheduleNotification = (event: CalendarEvent) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setTimeout(() => {
          new Notification(`Upcoming: ${event.title}`, {
            body: `${event.time} ${event.location ? `at ${event.location}` : ''}`,
            icon: '/favicon.ico'
          })
        }, 1000)
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setTimeout(() => {
              new Notification(`Upcoming: ${event.title}`, {
                body: `${event.time} ${event.location ? `at ${event.location}` : ''}`,
                icon: '/favicon.ico'
              })
            }, 1000)
          }
        })
      }
    }
  }

  const selectedDateEvents = selectedDate 
    ? events.filter(event => isSameDay(event.date, selectedDate))
    : []

  const getEventsByDay = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date))
  }

  const getDayTitle = (date: Date) => {
    if (isToday(date)) return "Today's Events"
    if (isTomorrow(date)) return "Tomorrow's Events"
    return `Events for ${format(date, "MMMM d, yyyy")}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage your family events and schedule
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
                modifiers={{
                  hasEvents: (date) => getEventsByDay(date).length > 0
                }}
                modifiersStyles={{
                  hasEvents: {
                    fontWeight: 'bold',
                    textDecoration: 'underline'
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {selectedDate ? getDayTitle(selectedDate) : "Select a date"}
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingEvent(null)
                      setNewEvent({
                        title: "",
                        description: "",
                        time: "",
                        location: "",
                        color: "blue",
                        notifications: true
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEvent ? "Edit Event" : "Create New Event"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location (optional)</Label>
                      <Input
                        id="location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        placeholder="Enter event description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Select value={newEvent.color} onValueChange={(value) => setNewEvent({...newEvent, color: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {eventColors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full ${color.class}`} />
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifications"
                        checked={newEvent.notifications}
                        onCheckedChange={(checked) => setNewEvent({...newEvent, notifications: checked})}
                      />
                      <Label htmlFor="notifications">Enable notifications</Label>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={editingEvent ? handleEditEvent : handleCreateEvent}
                        className="flex-1"
                      >
                        {editingEvent ? "Update Event" : "Create Event"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            eventColors.find(c => c.value === event.color)?.class || 'bg-blue-500'
                          }`} />
                          <div className="space-y-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            {event.description && (
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {event.time && (
                                <Badge variant="outline" className="gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.time}
                                </Badge>
                              )}
                              {event.location && (
                                <Badge variant="outline" className="gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </Badge>
                              )}
                              {event.notifications && (
                                <Badge variant="outline" className="gap-1">
                                  <Bell className="h-3 w-3" />
                                  Notifications
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No events scheduled for this date</p>
                  <p className="text-sm">Click "Add Event" to create one</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .filter(event => event.date >= startOfDay(new Date()))
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg border">
                      <div className={`w-2 h-2 rounded-full ${
                        eventColors.find(c => c.value === event.color)?.class || 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.date, "MMM d")} {event.time && `• ${event.time}`}
                        </p>
                      </div>
                    </div>
                  ))}
                {events.filter(event => event.date >= startOfDay(new Date())).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming events
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}