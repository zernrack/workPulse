"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Zap,
  Clock,
  Plus,
  CheckCircle,
  Settings,
  LogOut,
  Bell,
  LogIn,
  ClockIcon as ClockOut,
  Trash2,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"

interface Task {
  id: number
  text: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
}

export default function Home() {
  // Clock in/out state
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [totalTimeToday, setTotalTimeToday] = useState(0) // in minutes

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      text: "Review project proposals",
      completed: true,
      createdAt: new Date(Date.now() - 86400000),
      completedAt: new Date(Date.now() - 43200000),
    },
    {
      id: 2,
      text: "Update team documentation",
      completed: false,
      createdAt: new Date(Date.now() - 21600000),
    },
    {
      id: 3,
      text: "Prepare for client meeting",
      completed: false,
      createdAt: new Date(Date.now() - 10800000),
    },
  ])

  const [newTaskText, setNewTaskText] = useState("")

  // Update total time when clocked in
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isClockedIn && clockInTime) {
      interval = setInterval(() => {
        const now = new Date()
        const diffInMs = now.getTime() - clockInTime.getTime()
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        setTotalTimeToday(diffInMinutes)
      }, 60000) // Update every minute
    }
    return () => clearInterval(interval)
  }, [isClockedIn, clockInTime])

  // Clock in/out functions
  const handleClockIn = () => {
    const now = new Date()
    setIsClockedIn(true)
    setClockInTime(now)
    setTotalTimeToday(0)
    toast.success("Clocked in! Have a productive day! 🚀")
  }

  const handleClockOut = () => {
    if (clockInTime) {
      const now = new Date()
      const diffInMs = now.getTime() - clockInTime.getTime()
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      const hours = Math.floor(diffInMinutes / 60)
      const minutes = diffInMinutes % 60
      toast.success(`Clocked out! You worked for ${hours}h ${minutes}m today. Great job! 👏`)
    }
    setIsClockedIn(false)
    setClockInTime(null)
    setTotalTimeToday(0)
  }

  // Task functions
  const addTask = () => {
    if (!newTaskText.trim()) return

    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date(),
    }

    setTasks([newTask, ...tasks])
    setNewTaskText("")
    toast.success("Task added!")
  }

  const toggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
            }
          : task,
      ),
    )
  }

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    toast.success("Task deleted!")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  // Analytics calculations
  const completedTasks = tasks.filter((task) => task.completed)
  const todaysTasks = tasks.filter((task) => {
    const today = new Date()
    return task.createdAt.toDateString() === today.toDateString()
  })
  const todaysCompletedTasks = todaysTasks.filter((task) => task.completed)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Work Pulse</h1>
            </div>

            {/* Clock In/Out and User Menu */}
            <div className="flex items-center space-x-4">
              {/* Clock In/Out Button */}
              {!isClockedIn ? (
                <Button onClick={handleClockIn} className="bg-green-600 hover:bg-green-700 text-white">
                  <LogIn className="mr-2 h-4 w-4" />
                  Clock In
                </Button>
              ) : (
                <Button
                  onClick={handleClockOut}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <ClockOut className="mr-2 h-4 w-4" />
                  Clock Out
                </Button>
              )}

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">john@workpulse.com</p>
                      {isClockedIn && clockInTime && (
                        <p className="text-xs text-green-600 font-medium">
                          Clocked in at {clockInTime.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Good morning, John! 👋</h2>
            <p className="text-gray-600 text-lg">
              {isClockedIn
                ? `You've been productive for ${formatTime(totalTimeToday)} today!`
                : "Ready to start your productive day? Clock in to begin!"}
            </p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Time Today */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time Today</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {isClockedIn ? formatTime(totalTimeToday) : "0h 0m"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Completed Today */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{todaysCompletedTasks.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Tasks */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{tasks.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Banner */}
          {isClockedIn && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-green-800">You&apos;re clocked in and ready to work!</p>
                      <p className="text-sm text-green-600">
                        Started at {clockInTime?.toLocaleTimeString()} • {formatTime(totalTimeToday)} elapsed
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Todo Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Task Input */}
              <div className="flex space-x-2 mb-6">
                <Input
                  placeholder="Add a new task..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={addTask} disabled={!newTaskText.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks yet. Add your first task above!</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                        task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                          {task.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {task.completed && task.completedAt
                            ? `Completed ${task.completedAt.toLocaleString()}`
                            : `Created ${task.createdAt.toLocaleString()}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {/* Task Summary */}
              {tasks.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {completedTasks.length} of {tasks.length} tasks completed
                    </span>
                    <span>{tasks.length - completedTasks.length} remaining</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
