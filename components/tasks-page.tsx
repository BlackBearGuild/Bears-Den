"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  CheckSquare, 
  List, 
  ShoppingCart, 
  Trash2, 
  Edit,
  Star,
  Calendar,
  User,
  MoreVertical
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  assignedTo?: string
  listId: string
  createdAt: Date
}

interface TaskList {
  id: string
  name: string
  description?: string
  color: string
  isDefault?: boolean
  taskCount: number
  completedCount: number
}

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500', 
  high: 'bg-red-500'
}

const listColors = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
]

const groceryCategories = [
  'Produce', 'Dairy', 'Meat', 'Pantry', 'Frozen', 'Beverages', 'Snacks', 'Other'
]

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskLists, setTaskLists] = useState<TaskList[]>([])
  const [selectedList, setSelectedList] = useState<string>("")
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isListDialogOpen, setIsListDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingList, setEditingList] = useState<TaskList | null>(null)

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as 'low' | 'medium' | 'high',
    dueDate: "",
    assignedTo: "",
    category: "Other"
  })

  const [newList, setNewList] = useState({
    name: "",
    description: "",
    color: "blue"
  })

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    const savedLists = localStorage.getItem("task-lists")
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt)
      }))
      setTasks(parsedTasks)
    }
    
    if (savedLists) {
      const parsedLists = JSON.parse(savedLists)
      setTaskLists(parsedLists)
      if (parsedLists.length > 0 && !selectedList) {
        setSelectedList(parsedLists[0].id)
      }
    } else {
      // Create default lists
      const defaultLists = [
        {
          id: 'personal',
          name: 'Personal Tasks',
          description: 'Personal todo items',
          color: 'blue',
          isDefault: true,
          taskCount: 0,
          completedCount: 0
        },
        {
          id: 'grocery',
          name: 'Grocery List',
          description: 'Shopping list for groceries',
          color: 'green',
          isDefault: true,
          taskCount: 0,
          completedCount: 0
        }
      ]
      setTaskLists(defaultLists)
      setSelectedList('personal')
      localStorage.setItem("task-lists", JSON.stringify(defaultLists))
    }
  }, [])

  useEffect(() => {
    // Update task counts for lists
    const updatedLists = taskLists.map(list => ({
      ...list,
      taskCount: tasks.filter(task => task.listId === list.id).length,
      completedCount: tasks.filter(task => task.listId === list.id && task.completed).length
    }))
    setTaskLists(updatedLists)
    localStorage.setItem("task-lists", JSON.stringify(updatedLists))
  }, [tasks])

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  }

  const saveLists = (updatedLists: TaskList[]) => {
    setTaskLists(updatedLists)
    localStorage.setItem("task-lists", JSON.stringify(updatedLists))
  }

  const handleCreateTask = () => {
    if (!newTask.title || !selectedList) return

    const task: Task = {
      id: uuidv4(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      assignedTo: newTask.assignedTo,
      listId: selectedList,
      createdAt: new Date()
    }

    saveTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
      category: "Other"
    })
    setIsTaskDialogOpen(false)
  }

  const handleEditTask = () => {
    if (!editingTask || !newTask.title) return

    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id 
        ? { 
            ...task,
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
            assignedTo: newTask.assignedTo
          }
        : task
    )

    saveTasks(updatedTasks)
    setEditingTask(null)
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
      category: "Other"
    })
    setIsTaskDialogOpen(false)
  }

  const handleCreateList = () => {
    if (!newList.name) return

    const list: TaskList = {
      id: uuidv4(),
      name: newList.name,
      description: newList.description,
      color: newList.color,
      taskCount: 0,
      completedCount: 0
    }

    const updatedLists = [...taskLists, list]
    saveLists(updatedLists)
    setSelectedList(list.id)
    setNewList({
      name: "",
      description: "",
      color: "blue"
    })
    setIsListDialogOpen(false)
  }

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    saveTasks(updatedTasks)
  }

  const handleDeleteTask = (taskId: string) => {
    saveTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleDeleteList = (listId: string) => {
    const list = taskLists.find(l => l.id === listId)
    if (list?.isDefault) return // Can't delete default lists
    
    saveTasks(tasks.filter(task => task.listId !== listId))
    saveLists(taskLists.filter(list => list.id !== listId))
    
    if (selectedList === listId) {
      setSelectedList(taskLists[0]?.id || "")
    }
  }

  const openEditTaskDialog = (task: Task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? format(task.dueDate, "yyyy-MM-dd") : "",
      assignedTo: task.assignedTo || "",
      category: "Other"
    })
    setIsTaskDialogOpen(true)
  }

  const currentList = taskLists.find(list => list.id === selectedList)
  const currentTasks = tasks.filter(task => task.listId === selectedList)
  const pendingTasks = currentTasks.filter(task => !task.completed)
  const completedTasks = currentTasks.filter(task => task.completed)

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Organize your tasks with multiple lists and grocery shopping
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Lists Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Lists</CardTitle>
                <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingList(null)
                        setNewList({
                          name: "",
                          description: "",
                          color: "blue"
                        })
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New List</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="listName">List Name</Label>
                        <Input
                          id="listName"
                          value={newList.name}
                          onChange={(e) => setNewList({...newList, name: e.target.value})}
                          placeholder="Enter list name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="listDescription">Description (optional)</Label>
                        <Textarea
                          id="listDescription"
                          value={newList.description}
                          onChange={(e) => setNewList({...newList, description: e.target.value})}
                          placeholder="Enter list description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="listColor">Color</Label>
                        <Select value={newList.color} onValueChange={(value) => setNewList({...newList, color: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {listColors.map((color) => (
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
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleCreateList} className="flex-1">
                          Create List
                        </Button>
                        <Button variant="outline" onClick={() => setIsListDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 p-4">
                {taskLists.map((list) => (
                  <div 
                    key={list.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer group ${
                      selectedList === list.id ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedList(list.id)}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      listColors.find(c => c.value === list.color)?.class || 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {list.id === 'grocery' && <ShoppingCart className="h-4 w-4" />}
                        {list.id !== 'grocery' && <List className="h-4 w-4" />}
                        <span className="font-medium text-sm truncate">{list.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {list.completedCount}/{list.taskCount}
                        </Badge>
                        {list.taskCount > 0 && (
                          <div className="flex-1 bg-muted rounded-full h-1">
                            <div 
                              className="bg-primary rounded-full h-1 transition-all"
                              style={{ 
                                width: `${(list.completedCount / list.taskCount) * 100}%` 
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {!list.isDefault && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleDeleteList(list.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete List
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Content */}
        <div className="lg:col-span-3">
          {currentList ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {currentList.id === 'grocery' && <ShoppingCart className="h-5 w-5" />}
                      {currentList.id !== 'grocery' && <List className="h-5 w-5" />}
                      {currentList.name}
                    </CardTitle>
                    {currentList.description && (
                      <p className="text-sm text-muted-foreground">
                        {currentList.description}
                      </p>
                    )}
                  </div>
                  <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingTask(null)
                          setNewTask({
                            title: "",
                            description: "",
                            priority: "medium",
                            dueDate: "",
                            assignedTo: "",
                            category: "Other"
                          })
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {currentList.id === 'grocery' ? 'Add Item' : 'Add Task'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingTask ? 'Edit Task' : `Add ${currentList.id === 'grocery' ? 'Item' : 'Task'}`}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="taskTitle">
                            {currentList.id === 'grocery' ? 'Item Name' : 'Task Title'}
                          </Label>
                          <Input
                            id="taskTitle"
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            placeholder={currentList.id === 'grocery' ? 'Enter item name' : 'Enter task title'}
                          />
                        </div>
                        
                        {currentList.id === 'grocery' && (
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {groceryCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        <div>
                          <Label htmlFor="taskDescription">Description (optional)</Label>
                          <Textarea
                            id="taskDescription"
                            value={newTask.description}
                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                            placeholder="Enter description"
                            rows={3}
                          />
                        </div>
                        
                        {currentList.id !== 'grocery' && (
                          <>
                            <div>
                              <Label htmlFor="priority">Priority</Label>
                              <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="dueDate">Due Date (optional)</Label>
                              <Input
                                id="dueDate"
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="assignedTo">Assigned To (optional)</Label>
                              <Input
                                id="assignedTo"
                                value={newTask.assignedTo}
                                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                                placeholder="Enter person name"
                              />
                            </div>
                          </>
                        )}
                        
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={editingTask ? handleEditTask : handleCreateTask}
                            className="flex-1"
                          >
                            {editingTask ? 'Update' : 'Create'} {currentList.id === 'grocery' ? 'Item' : 'Task'}
                          </Button>
                          <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pending">
                      Pending ({pendingTasks.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({completedTasks.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pending" className="mt-6">
                    <div className="space-y-3">
                      {pendingTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => handleToggleTask(task.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{task.title}</h4>
                              {currentList.id !== 'grocery' && (
                                <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                              )}
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {task.dueDate && (
                                <Badge variant="outline" className="text-xs">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(task.dueDate, "MMM d")}
                                </Badge>
                              )}
                              {task.assignedTo && (
                                <Badge variant="outline" className="text-xs">
                                  <User className="h-3 w-3 mr-1" />
                                  {task.assignedTo}
                                </Badge>
                              )}
                              {currentList.id !== 'grocery' && (
                                <Badge variant="outline" className="text-xs">
                                  {task.priority} priority
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditTaskDialog(task)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {pendingTasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No pending {currentList.id === 'grocery' ? 'items' : 'tasks'}</p>
                          <p className="text-sm">
                            Click "Add {currentList.id === 'grocery' ? 'Item' : 'Task'}" to create one
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-6">
                    <div className="space-y-3">
                      {completedTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => handleToggleTask(task.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-1 opacity-60">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium line-through">{task.title}</h4>
                              {currentList.id !== 'grocery' && (
                                <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                              )}
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground line-through">{task.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {completedTasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No completed {currentList.id === 'grocery' ? 'items' : 'tasks'}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center space-y-4">
                  <List className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">No list selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a list from the sidebar to view tasks
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