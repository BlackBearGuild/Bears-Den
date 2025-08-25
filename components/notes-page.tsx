"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  Plus, 
  FileText, 
  Folder, 
  Search, 
  Edit, 
  Trash2, 
  FolderPlus,
  Share,
  Lock,
  Eye,
  EyeOff,
  Link2,
  ChevronRight,
  ChevronDown
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

interface Note {
  id: string
  title: string
  content: string
  folderId: string | null
  isPrivate: boolean
  sharedWith: string[]
  createdAt: Date
  updatedAt: Date
  linkedNotes: string[]
}

interface Folder {
  id: string
  name: string
  parentId: string | null
  isExpanded?: boolean
}

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    folderId: null as string | null,
    isPrivate: true,
    sharedWith: [] as string[]
  })
  
  const [newFolder, setNewFolder] = useState({
    name: "",
    parentId: null as string | null
  })

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    const savedFolders = localStorage.getItem("folders")
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }))
      setNotes(parsedNotes)
    }
    
    if (savedFolders) {
      const parsedFolders = JSON.parse(savedFolders)
      setFolders(parsedFolders)
    }
  }, [])

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes)
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
  }

  const saveFolders = (updatedFolders: Folder[]) => {
    setFolders(updatedFolders)
    localStorage.setItem("folders", JSON.stringify(updatedFolders))
  }

  const handleCreateNote = () => {
    if (!newNote.title) return

    const note: Note = {
      id: uuidv4(),
      title: newNote.title,
      content: newNote.content,
      folderId: selectedFolder || newNote.folderId,
      isPrivate: newNote.isPrivate,
      sharedWith: newNote.sharedWith,
      createdAt: new Date(),
      updatedAt: new Date(),
      linkedNotes: []
    }

    saveNotes([...notes, note])
    setNewNote({
      title: "",
      content: "",
      folderId: null,
      isPrivate: true,
      sharedWith: []
    })
    setIsNoteDialogOpen(false)
    setSelectedNote(note)
  }

  const handleEditNote = () => {
    if (!editingNote || !newNote.title) return

    const updatedNotes = notes.map(note => 
      note.id === editingNote.id 
        ? { 
            ...editingNote, 
            ...newNote, 
            updatedAt: new Date(),
            linkedNotes: extractLinkedNotes(newNote.content)
          }
        : note
    )

    saveNotes(updatedNotes)
    setSelectedNote(updatedNotes.find(n => n.id === editingNote.id) || null)
    setEditingNote(null)
    setNewNote({
      title: "",
      content: "",
      folderId: null,
      isPrivate: true,
      sharedWith: []
    })
    setIsNoteDialogOpen(false)
  }

  const handleCreateFolder = () => {
    if (!newFolder.name) return

    const folder: Folder = {
      id: uuidv4(),
      name: newFolder.name,
      parentId: selectedFolder || newFolder.parentId,
      isExpanded: false
    }

    saveFolders([...folders, folder])
    setNewFolder({ name: "", parentId: null })
    setIsFolderDialogOpen(false)
  }

  const handleDeleteNote = (noteId: string) => {
    saveNotes(notes.filter(note => note.id !== noteId))
    if (selectedNote?.id === noteId) {
      setSelectedNote(null)
    }
  }

  const handleDeleteFolder = (folderId: string) => {
    // Move notes in this folder to root
    const updatedNotes = notes.map(note => 
      note.folderId === folderId ? { ...note, folderId: null } : note
    )
    saveNotes(updatedNotes)
    
    // Remove folder and its subfolders
    const foldersToDelete = getAllSubfolders(folderId)
    saveFolders(folders.filter(folder => !foldersToDelete.includes(folder.id)))
  }

  const getAllSubfolders = (folderId: string): string[] => {
    const subfolders = folders.filter(f => f.parentId === folderId)
    let allSubfolders = [folderId]
    
    subfolders.forEach(subfolder => {
      allSubfolders = [...allSubfolders, ...getAllSubfolders(subfolder.id)]
    })
    
    return allSubfolders
  }

  const extractLinkedNotes = (content: string): string[] => {
    const linkRegex = /\[\[([^\]]+)\]\]/g
    const matches = content.match(linkRegex) || []
    return matches.map(match => match.slice(2, -2))
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setNewNote({
      title: note.title,
      content: note.content,
      folderId: note.folderId,
      isPrivate: note.isPrivate,
      sharedWith: note.sharedWith
    })
    setIsNoteDialogOpen(true)
  }

  const toggleFolderExpansion = (folderId: string) => {
    const updatedFolders = folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, isExpanded: !folder.isExpanded }
        : folder
    )
    saveFolders(updatedFolders)
  }

  const renderFolderTree = (parentId: string | null = null, level = 0) => {
    const folderList = folders
      .filter(folder => folder.parentId === parentId)
      .map(folder => {
        const folderNotes = notes.filter(note => note.folderId === folder.id)
        const hasSubfolders = folders.some(f => f.parentId === folder.id)
        
        return (
          <div key={folder.id} style={{ marginLeft: `${level * 16}px` }}>
            <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted cursor-pointer group">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleFolderExpansion(folder.id)}
              >
                {hasSubfolders ? (
                  folder.isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )
                ) : (
                  <div className="h-3 w-3" />
                )}
              </Button>
              <Folder className="h-4 w-4 text-blue-500" />
              <span 
                className="flex-1 text-sm font-medium"
                onClick={() => setSelectedFolder(folder.id)}
              >
                {folder.name}
              </span>
              <Badge variant="secondary" className="text-xs">
                {folderNotes.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={() => handleDeleteFolder(folder.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            {folder.isExpanded && (
              <div>
                {renderFolderTree(folder.id, level + 1)}
                {folderNotes.map(note => (
                  <div 
                    key={note.id}
                    style={{ marginLeft: `${(level + 1) * 16 + 24}px` }}
                    className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer group ${
                      selectedNote?.id === note.id ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedNote(note)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="flex-1 text-sm truncate">{note.title}</span>
                    {note.isPrivate ? (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Share className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })

    return folderList
  }

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const rootNotes = selectedFolder 
    ? notes.filter(note => note.folderId === selectedFolder)
    : notes.filter(note => note.folderId === null)

  const displayNotes = searchTerm ? filteredNotes : rootNotes

  const renderContentWithLinks = (content: string) => {
    return content.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
      const linkedNote = notes.find(note => 
        note.title.toLowerCase() === linkText.toLowerCase()
      )
      if (linkedNote) {
        return `[${linkText}](#${linkedNote.id})`
      }
      return match
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <p className="text-muted-foreground">
          Create and organize your markdown notes with folder hierarchy and linking
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Folders & Notes</CardTitle>
                <div className="flex gap-1">
                  <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Folder</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="folderName">Folder Name</Label>
                          <Input
                            id="folderName"
                            value={newFolder.name}
                            onChange={(e) => setNewFolder({...newFolder, name: e.target.value})}
                            placeholder="Enter folder name"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleCreateFolder} className="flex-1">
                            Create Folder
                          </Button>
                          <Button variant="outline" onClick={() => setIsFolderDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingNote(null)
                          setNewNote({
                            title: "",
                            content: "",
                            folderId: null,
                            isPrivate: true,
                            sharedWith: []
                          })
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingNote ? "Edit Note" : "Create New Note"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 overflow-y-auto">
                        <div>
                          <Label htmlFor="noteTitle">Title</Label>
                          <Input
                            id="noteTitle"
                            value={newNote.title}
                            onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                            placeholder="Enter note title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="noteContent">Content (Markdown supported)</Label>
                          <Textarea
                            id="noteContent"
                            value={newNote.content}
                            onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                            placeholder="Write your note in markdown... Use [[Note Title]] to link to other notes"
                            rows={10}
                            className="font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Use [[Note Title]] syntax to link to other notes
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isPrivate"
                            checked={newNote.isPrivate}
                            onCheckedChange={(checked) => setNewNote({...newNote, isPrivate: checked})}
                          />
                          <Label htmlFor="isPrivate" className="flex items-center gap-2">
                            {newNote.isPrivate ? <Lock className="h-4 w-4" /> : <Share className="h-4 w-4" />}
                            {newNote.isPrivate ? "Private note" : "Shared note"}
                          </Label>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={editingNote ? handleEditNote : handleCreateNote}
                            className="flex-1"
                          >
                            {editingNote ? "Update Note" : "Create Note"}
                          </Button>
                          <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-2">
                  {/* Root folder */}
                  <div 
                    className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer ${
                      selectedFolder === null ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedFolder(null)}
                  >
                    <Folder className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">All Notes</span>
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {notes.filter(n => n.folderId === null).length}
                    </Badge>
                  </div>
                  
                  {/* Folder tree */}
                  {renderFolderTree()}
                  
                  {/* Root notes when no search */}
                  {!searchTerm && selectedFolder === null && (
                    <div className="mt-4 space-y-1">
                      {notes.filter(note => note.folderId === null).map(note => (
                        <div 
                          key={note.id}
                          className={`flex items-center gap-2 py-2 px-2 rounded cursor-pointer group ${
                            selectedNote?.id === note.id ? 'bg-primary/10' : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedNote(note)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="flex-1 text-sm truncate">{note.title}</span>
                          {note.isPrivate ? (
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Share className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Search results */}
                  {searchTerm && (
                    <div className="mt-4 space-y-1">
                      <Separator />
                      <p className="text-xs text-muted-foreground px-2 py-1">Search Results</p>
                      {filteredNotes.map(note => (
                        <div 
                          key={note.id}
                          className={`flex items-center gap-2 py-2 px-2 rounded cursor-pointer group ${
                            selectedNote?.id === note.id ? 'bg-primary/10' : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedNote(note)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="flex-1 text-sm truncate">{note.title}</span>
                          {note.isPrivate ? (
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Share className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {selectedNote ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {selectedNote.title}
                      {selectedNote.isPrivate ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Share className="h-4 w-4 text-green-500" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created {selectedNote.createdAt.toLocaleDateString()} • 
                      Updated {selectedNote.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                      {isPreviewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isPreviewMode ? "Edit" : "Preview"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(selectedNote)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(selectedNote.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {selectedNote.linkedNotes.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Links to: {selectedNote.linkedNotes.join(', ')}
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {isPreviewMode ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          a: ({ href, children, ...props }) => {
                            if (href?.startsWith('#')) {
                              const noteId = href.slice(1)
                              const linkedNote = notes.find(n => n.id === noteId)
                              return (
                                <button
                                  className="text-blue-600 hover:underline"
                                  onClick={() => linkedNote && setSelectedNote(linkedNote)}
                                  type="button"
                                >
                                  {children}
                                </button>
                              )
                            }
                            return <a href={href} {...props}>{children}</a>
                          }
                        }}
                      >
                        {renderContentWithLinks(selectedNote.content)}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <Textarea
                      value={selectedNote.content}
                      onChange={(e) => {
                        const updatedNote = { ...selectedNote, content: e.target.value }
                        setSelectedNote(updatedNote)
                        const updatedNotes = notes.map(note => 
                          note.id === selectedNote.id ? updatedNote : note
                        )
                        saveNotes(updatedNotes)
                      }}
                      className="min-h-[550px] resize-none font-mono text-sm border-none p-0"
                      placeholder="Start writing your note..."
                    />
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center space-y-4">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">No note selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a note from the sidebar to start reading or editing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}