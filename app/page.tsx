"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Zap, Clock, CheckCircle, BarChart3, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">

      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-white">Work Pulse</h1>
            </div>
            <Link href="/login">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Content */}
            <div className="mb-16">
              <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                Track Your
                <br />
                <span className="text-blue-200">Productivity</span>
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Simple time tracking and task management. Clock in, add tasks, and see your productivity analytics in
                one clean dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 h-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {/* <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-4 h-auto"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Try Demo
                  </Button>
                </Link> */}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Simple Time Tracking</h3>
                  <p className="text-blue-100">
                    Clock in and out with one click. Track your productive hours effortlessly.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Task Management</h3>
                  <p className="text-blue-100">Add tasks like a todo app. Check them off as you complete them.</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Analytics Dashboard</h3>
                  <p className="text-blue-100">See your productivity stats and completion rates at a glance.</p>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Preview */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-white mb-8">See Your Productivity in Action</h3>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-8">
                <div className="bg-white rounded-lg p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">Work Pulse</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Clocked In</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">6h 42m</div>
                      <div className="text-sm text-gray-600">Time Today</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">8</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-sm text-gray-600">Total Tasks</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">67%</div>
                      <div className="text-sm text-gray-600">Completion</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-5 h-5 bg-green-500 rounded border-2 border-green-500 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-600 line-through">Review project proposals</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-900">Update team documentation</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-900">Prepare for client meeting</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to boost your productivity?</h3>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of professionals who track their work with Work Pulse.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-12 py-6 h-auto">
                  Start Tracking Today
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-100"> 2024 Work Pulse. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
