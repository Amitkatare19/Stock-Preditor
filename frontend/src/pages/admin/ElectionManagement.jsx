"use client"

import React, { useState } from "react"
import {
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Filter,
  Plus,
  Search,
  Trash,
  X,
} from "lucide-react"

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

// Badge component
const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        variant === "secondary" && "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "success" && "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        variant === "destructive" &&
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        variant === "outline" && "text-foreground",
        variant === "warning" && "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        className,
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export default function ElectionManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddElection, setShowAddElection] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [electionToDelete, setElectionToDelete] = useState(null)
  const [newElection, setNewElection] = useState({
    title: "",
    date: "",
    type: "National",
    description: "",
    phases: 1,
  })

  // Mock election data
  const elections = [
    {
      id: "ge2025",
      title: "General Elections 2025",
      date: "2025-04-15",
      daysLeft: 28,
      type: "National",
      status: "Scheduled",
      description: "Parliamentary elections to elect members of the Lok Sabha",
      phases: 3,
      registeredVoters: 245678,
    },
    {
      id: "mc2025",
      title: "Municipal Corporation Elections",
      date: "2025-06-10",
      daysLeft: 84,
      type: "Local",
      status: "Scheduled",
      description: "Elections to elect members of the Municipal Corporation",
      phases: 1,
      registeredVoters: 125432,
    },
    {
      id: "pc2024",
      title: "Panchayat Elections",
      date: "2024-12-05",
      daysLeft: 260,
      type: "Local",
      status: "Scheduled",
      description: "Elections to elect members of the Panchayat",
      phases: 1,
      registeredVoters: 85621,
    },
    {
      id: "se2026",
      title: "State Assembly Elections",
      date: "2026-02-20",
      daysLeft: 340,
      type: "State",
      status: "Planned",
      description: "Elections to elect members of the State Legislative Assembly",
      phases: 2,
      registeredVoters: 198745,
    },
    {
      id: "ge2020",
      title: "General Elections 2020",
      date: "2020-05-10",
      daysLeft: 0,
      type: "National",
      status: "Completed",
      description: "Parliamentary elections to elect members of the Lok Sabha",
      phases: 3,
      registeredVoters: 235421,
      turnout: "68.5%",
    },
    {
      id: "se2021",
      title: "State Assembly Elections 2021",
      date: "2021-03-15",
      daysLeft: 0,
      type: "State",
      status: "Completed",
      description: "Elections to elect members of the State Legislative Assembly",
      phases: 2,
      registeredVoters: 187654,
      turnout: "72.3%",
    },
  ]

  // Filter elections based on search query and filter type
  const filteredElections = elections.filter((election) => {
    const matchesSearch =
      election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      election.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterType === "all") return matchesSearch
    if (filterType === "completed") return matchesSearch && election.status === "Completed"
    if (filterType === "upcoming")
      return matchesSearch && (election.status === "Scheduled" || election.status === "Planned")
    return matchesSearch && election.type.toLowerCase() === filterType.toLowerCase()
  })

  // Pagination
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredElections.length / itemsPerPage)
  const paginatedElections = filteredElections.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle delete confirmation
  const confirmDelete = (election) => {
    setElectionToDelete(election)
    setShowDeleteConfirm(true)
  }

  // Handle delete election
  const handleDeleteElection = () => {
    // In a real app, you would delete the election from the database
    console.log(`Deleting election: ${electionToDelete.id}`)
    setShowDeleteConfirm(false)
    setElectionToDelete(null)
  }

  // Handle add election
  const handleAddElection = (e) => {
    e.preventDefault()
    // In a real app, you would add the election to the database
    console.log("Adding new election:", newElection)
    setShowAddElection(false)
    setNewElection({
      title: "",
      date: "",
      type: "National",
      description: "",
      phases: 1,
    })
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Election Management</h1>
        <p className="text-gray-500">Schedule and manage elections</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search elections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Elections</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="national">National</option>
                  <option value="state">State</option>
                  <option value="local">Local</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" onClick={() => setShowAddElection(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Election
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-sm font-medium text-gray-500">
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Election ID</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Title</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Date</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Type</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Status</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Registered Voters</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedElections.length > 0 ? (
                  paginatedElections.map((election) => (
                    <tr key={election.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{election.id}</td>
                      <td className="px-4 py-3">{election.title}</td>
                      <td className="px-4 py-3">{election.date}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            election.type === "National"
                              ? "default"
                              : election.type === "State"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {election.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            election.status === "Completed"
                              ? "success"
                              : election.status === "Scheduled"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {election.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{election.registeredVoters.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Edit</span>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => confirmDelete(election)}
                          >
                            <span className="sr-only">Delete</span>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-gray-500">No elections found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredElections.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredElections.length)} of {filteredElections.length} elections
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Election Modal */}
      {showAddElection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add New Election</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowAddElection(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleAddElection}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                    Election Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={newElection.title}
                    onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
                    Election Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={newElection.date}
                    onChange={(e) => setNewElection({ ...newElection, date: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">
                    Election Type
                  </label>
                  <select
                    id="type"
                    value={newElection.type}
                    onChange={(e) => setNewElection({ ...newElection, type: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="National">National</option>
                    <option value="State">State</option>
                    <option value="Local">Local</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="phases" className="mb-1 block text-sm font-medium text-gray-700">
                    Number of Phases
                  </label>
                  <input
                    id="phases"
                    type="number"
                    min="1"
                    max="7"
                    value={newElection.phases}
                    onChange={(e) => setNewElection({ ...newElection, phases: Number.parseInt(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newElection.description}
                    onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowAddElection(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Election
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
              <p className="mt-2 text-gray-600">
                Are you sure you want to delete the election "{electionToDelete?.title}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteElection}>
                Delete Election
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

