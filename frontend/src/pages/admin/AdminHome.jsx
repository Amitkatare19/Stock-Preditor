"use client"

import React from "react"
import { Link } from "react-router-dom"
import { BarChart3, Calendar, ChevronRight, Clock, FileText, MapPin, PieChart, Plus, User, Users } from "lucide-react"

// Simple utility function for combining class names without dependencies
const cn = (...classes) => {
  return classes
    .filter(Boolean)
    .join(" ")
    .replace(/border-border/g, "border")
}

// Card components
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

// Button component
const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"

    let variantClasses = ""
    if (variant === "default") variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90"
    else if (variant === "destructive")
      variantClasses = "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    else if (variant === "outline")
      variantClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    else if (variant === "secondary") variantClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    else if (variant === "ghost") variantClasses = "hover:bg-accent hover:text-accent-foreground"
    else if (variant === "link") variantClasses = "text-primary underline-offset-4 hover:underline"

    let sizeClasses = ""
    if (size === "default") sizeClasses = "h-10 px-4 py-2"
    else if (size === "sm") sizeClasses = "h-9 rounded-md px-3"
    else if (size === "lg") sizeClasses = "h-11 rounded-md px-8"
    else if (size === "icon") sizeClasses = "h-10 w-10"

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses,
          sizeClasses,
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export default function AdminHome() {
  // Mock data for the dashboard
  const stats = {
    totalVoters: 245678,
    newRegistrations: 1245,
    pendingVerifications: 328,
    upcomingElections: 3,
    activePollingStations: 1250,
  }

  // Recent registrations
  const recentRegistrations = [
    { id: "V123456", name: "Rahul Sharma", date: "2023-04-15", status: "Verified" },
    { id: "V123457", name: "Priya Patel", date: "2023-04-15", status: "Pending" },
    { id: "V123458", name: "Amit Kumar", date: "2023-04-14", status: "Verified" },
    { id: "V123459", name: "Sneha Gupta", date: "2023-04-14", status: "Rejected" },
    { id: "V123460", name: "Vikram Singh", date: "2023-04-13", status: "Verified" },
  ]

  // Upcoming elections
  const upcomingElections = [
    {
      id: "ge2025",
      title: "General Elections 2025",
      date: "April 15, 2025",
      daysLeft: 28,
      type: "National",
    },
    {
      id: "mc2025",
      title: "Municipal Corporation Elections",
      date: "June 10, 2025",
      daysLeft: 84,
      type: "Local",
    },
    {
      id: "pc2024",
      title: "Panchayat Elections",
      date: "December 5, 2024",
      daysLeft: 260,
      type: "Local",
    },
  ]

  return (
    <div className="p-4 md:p-6">
      {/* Welcome Banner */}
      <div className="relative mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-blue-100">
            Manage voter registrations, elections, and polling stations from a central location.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/admin/register-user"
              className="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              Register New Voter
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              to="/admin/elections"
              className="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              Manage Elections
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Voters</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalVoters.toLocaleString()}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">New Registrations</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.newRegistrations.toLocaleString()}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <User className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.pendingVerifications.toLocaleString()}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming Elections</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.upcomingElections.toLocaleString()}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Polling Stations</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.activePollingStations.toLocaleString()}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Recent Registrations */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Registrations</CardTitle>
              <Link to="/admin/voters" className="text-sm font-medium text-blue-600 hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-gray-500">
                      <th className="pb-2 pl-0">Voter ID</th>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2 pr-0">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentRegistrations.map((registration) => (
                      <tr key={registration.id} className="text-sm">
                        <td className="py-3 pl-0 font-medium">{registration.id}</td>
                        <td className="py-3">{registration.name}</td>
                        <td className="py-3">{registration.date}</td>
                        <td className="py-3 pr-0">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              registration.status === "Verified"
                                ? "bg-green-100 text-green-800"
                                : registration.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {registration.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/register-user">
                  <Plus className="mr-2 h-4 w-4" />
                  Register New Voter
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Elections */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Upcoming Elections</CardTitle>
              <Link to="/admin/elections" className="text-sm font-medium text-blue-600 hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingElections.map((election) => (
                <div
                  key={election.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{election.title}</h4>
                      <p className="text-sm text-gray-500">
                        {election.date} • {election.daysLeft} days left
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      election.type === "National" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {election.type}
                  </span>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/elections">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Election
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Registration Analytics */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Registration Analytics</CardTitle>
            <CardDescription>Voter registration trends over time</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
              <div className="text-center">
                <BarChart3 className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Registration Analytics Chart</p>
                <p className="text-xs text-gray-400">(Chart visualization would appear here)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demographic Distribution */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Demographic Distribution</CardTitle>
            <CardDescription>Voter demographics by age and gender</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
              <div className="text-center">
                <PieChart className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Demographic Distribution Chart</p>
                <p className="text-xs text-gray-400">(Chart visualization would appear here)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Link
            to="/admin/register-user"
            className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Register Voter</h3>
              <p className="text-sm text-gray-500">Add new voter</p>
            </div>
          </Link>

          <Link
            to="/admin/elections"
            className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Elections</h3>
              <p className="text-sm text-gray-500">Schedule and edit</p>
            </div>
          </Link>

          <Link
            to="/admin/polling-stations"
            className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Polling Stations</h3>
              <p className="text-sm text-gray-500">Add and manage locations</p>
            </div>
          </Link>

          <Link
            to="/admin/reports"
            className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Generate Reports</h3>
              <p className="text-sm text-gray-500">View and export data</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

