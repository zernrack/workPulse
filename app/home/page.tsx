"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Zap,
  Clock,
  Plus,
  CheckCircle,
  Settings,
  LogOut,
  LogIn,
  ClockIcon as ClockOut,
  Trash2,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  createTaskAction,
  getAllTasksAction,
  deleteTaskAction,
  toggleTaskAction,
} from "@/app/actions/task";
import { logout } from "@/app/actions/auth";
import { useUserProfile } from "@/hooks/useUserProfile";

// Database task type
interface DbTask {
  id: string;
  userId: string;
  task_name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  isComplete: boolean;
}

export default function Home() {
  // Clock in/out state
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [totalTimeToday, setTotalTimeToday] = useState(0); // in minutes

  // User state - now using custom hook
  const { user, isLoading: userLoading } = useUserProfile();

  // Tasks state - now using database tasks
  const [tasks, setTasks] = useState<DbTask[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const result = await getAllTasksAction();
      if (result?.serverError) {
        toast.error(result.serverError);
      } else if (result?.data?.success) {
        setTasks(result.data.tasks);
      }
    } catch (error) {
      toast.error("Failed to load tasks");
      console.error("Load tasks error:", error);
    }
  };

  // Update total time when clocked in
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn && clockInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diffInMs = now.getTime() - clockInTime.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        setTotalTimeToday(diffInMinutes);
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [isClockedIn, clockInTime]);

  // Clock in/out functions
  const handleClockIn = () => {
    const now = new Date();
    setIsClockedIn(true);
    setClockInTime(now);
    setTotalTimeToday(0);
    toast.success("Clocked in! Have a productive day! 🚀");
  };

  const handleClockOut = () => {
    if (clockInTime) {
      const now = new Date();
      const diffInMs = now.getTime() - clockInTime.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      toast.success(
        `Clocked out! You worked for ${hours}h ${minutes}m today. Great job! 👏`
      );
    }
    setIsClockedIn(false);
    setClockInTime(null);
    setTotalTimeToday(0);
  };

  // Task functions - now using database actions
  const addTask = async () => {
    if (!newTaskText.trim()) return;

    setIsLoading(true);
    try {
      const result = await createTaskAction({
        task_name: newTaskText.trim(),
        description: "",
      });

      if (result?.serverError) {
        toast.error(result.serverError);
      } else if (result?.data?.success) {
        await loadTasks(); // Reload tasks to get the latest data
        setNewTaskText("");
        toast.success("Task added!");
      }
    } catch (error) {
      toast.error("Failed to add task");
      console.error("Add task error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      const result = await toggleTaskAction({ taskId });

      if (result?.serverError) {
        toast.error(result.serverError);
      } else if (result?.data?.success) {
        await loadTasks(); // Reload tasks to get the latest data
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          toast.success(
            task.isComplete ? "Task marked as incomplete" : "Task completed! 🎉"
          );
        }
      }
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Toggle task error:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const result = await deleteTaskAction({ taskId });

      if (result?.serverError) {
        toast.error(result.serverError);
      } else if (result?.data?.success) {
        await loadTasks(); // Reload tasks to get the latest data
        toast.success("Task deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Delete task error:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // Analytics calculations
  const completedTasks = tasks.filter((task) => task.isComplete);
  const todaysTasks = tasks.filter((task) => {
    const today = new Date();
    return task.createdAt.toDateString() === today.toDateString();
  });
  const todaysCompletedTasks = todaysTasks.filter((task) => task.isComplete);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";

    console.log("hours deet:", hour);
    return "Good Evening";
  };

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
                <Button
                  onClick={handleClockIn}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user?.firstName && user?.lastName
                          ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      {userLoading ? (
                        <>
                          <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                          <div className="animate-pulse bg-gray-200 h-3 w-40 rounded"></div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium leading-none">
                            {user?.firstName && user?.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user?.userName || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || "user@workpulse.com"}
                          </p>
                          {user?.role && (
                            <p className="text-xs leading-none text-blue-600 font-medium capitalize">
                              {user.role}
                            </p>
                          )}
                        </>
                      )}
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
                  <DropdownMenuItem onClick={() => logout()}>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {userLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
              ) : (
                `${getGreeting()}, ${user?.firstName || "User"}! 👋`
              )}
            </h2>
            <p className="text-gray-600 text-lg">
              {isClockedIn
                ? `You've been productive for ${formatTime(
                    totalTimeToday
                  )} today!`
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
                    <p className="text-sm font-medium text-gray-600">
                      Time Today
                    </p>
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
                    <p className="text-sm font-medium text-gray-600">
                      Completed Today
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {todaysCompletedTasks.length}
                    </p>
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
                    <p className="text-sm font-medium text-gray-600">
                      Total Tasks
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {tasks.length}
                    </p>
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
                    <p className="text-sm font-medium text-gray-600">
                      Completion Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {tasks.length > 0
                        ? Math.round(
                            (completedTasks.length / tasks.length) * 100
                          )
                        : 0}
                      %
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
                      <p className="font-medium text-green-800">
                        You&apos;re clocked in and ready to work!
                      </p>
                      <p className="text-sm text-green-600">
                        Started at {clockInTime?.toLocaleTimeString()} •{" "}
                        {formatTime(totalTimeToday)} elapsed
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
                <Button
                  onClick={addTask}
                  disabled={!newTaskText.trim() || isLoading}
                >
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
                        task.isComplete
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Checkbox
                        checked={task.isComplete}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            task.isComplete
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {task.task_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {task.isComplete
                            ? `Completed ${
                                task.updatedAt?.toLocaleString() || ""
                              }`
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
                    <span>
                      {tasks.length - completedTasks.length} remaining
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          tasks.length > 0
                            ? (completedTasks.length / tasks.length) * 100
                            : 0
                        }%`,
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
  );
}
