"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  User,
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

export default function VoterManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVoters, setSelectedVoters] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [voterToDelete, setVoterToDelete] = useState(null)
  const [showVoterDetails, setShowVoterDetails] = useState(false)
  const [selectedVoterDetails, setSelectedVoterDetails] = useState(null)

  // Mock voter data
  const voters = [
    {
      id: "V123456",
      name: "Rahul Sharma",
      aadhaar: "1234 5678 9012",
      dob: "1985-06-15",
      gender: "Male",
      address: "123 MG Road, Bangalore, Karnataka 560001",
      phone: "9876543210",
      email: "rahul.sharma@example.com",
      constituency: "Bangalore Central",
      pollingStation: "St. Joseph's College",
      registrationDate: "2023-04-15",
      status: "Verified",
    },
    {
      id: "V123457",
      name: "Priya Patel",
      aadhaar: "2345 6789 0123",
      dob: "1990-03-22",
      gender: "Female",
      address: "456 Brigade Road, Bangalore, Karnataka 560001",
      phone: "8765432109",
      email: "priya.patel@example.com",
      constituency: "Bangalore South",
      pollingStation: "National College",
      registrationDate: "2023-04-15",
      status: "Pending",
    },
    {
      id: "V123458",
      name: "Amit Kumar",
      aadhaar: "3456 7890 1234",
      dob: "1982-11-10",
      gender: "Male",
      address: "789 Residency Road, Bangalore, Karnataka 560025",
      phone: "7654321098",
      email: "amit.kumar@example.com",
      constituency: "Bangalore North",
      pollingStation: "Hebbal School",
      registrationDate: "2023-04-14",
      status: "Verified",
    },
    {
      id: "V123459",
      name: "Sneha Gupta",
      aadhaar: "4567 8901 2345",
      dob: "1995-08-05",
      gender: "Female",
      address: "101 Indiranagar, Bangalore, Karnataka 560038",
      phone: "6543210987",
      email: "sneha.gupta@example.com",
      constituency: "Bangalore East",
      pollingStation: "Indiranagar School",
      registrationDate: "2023-04-14",
      status: "Rejected",
    },
    {
      id: "V123460",
      name: "Vikram Singh",
      aadhaar: "5678 9012 3456",
      dob: "1978-02-28",
      gender: "Male",
      address: "202 Koramangala, Bangalore, Karnataka 560034",
      phone: "5432109876",
      email: "vikram.singh@example.com",
      constituency: "Bangalore South",
      pollingStation: "BTM Layout Community Hall",
      registrationDate: "2023-04-13",
      status: "Verified",
    },
    {
      id: "V123461",
      name: "Neha Reddy",
      aadhaar: "6789 0123 4567",
      dob: "1992-12-18",
      gender: "Female",
      address: "303 JP Nagar, Bangalore, Karnataka 560078",
      phone: "4321098765",
      email: "neha.reddy@example.com",
      constituency: "Bangalore South",
      pollingStation: "National College",
      registrationDate: "2023-04-13",
      status: "Pending",
    },
    {
      id: "V123462",
      name: "Rajesh Verma",
      aadhaar: "7890 1234 5678",
      dob: "1975-05-20",
      gender: "Male",
      address: "404 Whitefield, Bangalore, Karnataka 560066",
      phone: "3210987654",
      email: "rajesh.verma@example.com",
      constituency: "Bangalore East",
      pollingStation: "Whitefield Community Center",
      registrationDate: "2023-04-12",
      status: "Verified",
    },
    {
      id: "V123463",
      name: "Ananya Desai",
      aadhaar: "8901 2345 6789",
      dob: "1988-09-30",
      gender: "Female",
      address: "505 HSR Layout, Bangalore, Karnataka 560102",
      phone: "2109876543",
      email: "ananya.desai@example.com",
      constituency: "Bangalore South",
      pollingStation: "HSR BDA Complex",
      registrationDate: "2023-04-12",
      status: "Verified",
    },
  ]

  // Filter voters based on search query and status
  const filteredVoters = voters.filter((voter) => {
    const matchesSearch =
      voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voter.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voter.aadhaar.replace(/\s/g, "").includes(searchQuery.replace(/\s/g, ""))

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && voter.status.toLowerCase() === filterStatus.toLowerCase()
  })

  // Pagination
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredVoters.length / itemsPerPage)
  const paginatedVoters = filteredVoters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVoters(paginatedVoters.map((voter) => voter.id))
    } else {
      setSelectedVoters([])
    }
  }

  // Handle select voter
  const handleSelectVoter = (voterId) => {
    if (selectedVoters.includes(voterId)) {
      setSelectedVoters(selectedVoters.filter((id) => id !== voterId))
    } else {
      setSelectedVoters([...selectedVoters, voterId])
    }
  }

  // Handle delete confirmation
  const confirmDelete = (voter) => {
    setVoterToDelete(voter)
    setShowDeleteConfirm(true)
  }

  // Handle delete voter
  const handleDeleteVoter = () => {
    // In a real app, you would delete the voter from the database
    console.log(`Deleting voter: ${voterToDelete.id}`)
    setShowDeleteConfirm(false)
    setVoterToDelete(null)
  }

  // Handle view voter details
  const viewVoterDetails = (voter) => {
    setSelectedVoterDetails(voter)
    setShowVoterDetails(true)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Voter Management</h1>
        <p className="text-gray-500">View and manage registered voters</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search voters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button asChild size="sm">
                <Link to="/admin/register-user">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Voter
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-sm font-medium text-gray-500">
                  <th className="px-4 py-3 pl-0">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={handleSelectAll}
                        checked={selectedVoters.length === paginatedVoters.length && paginatedVoters.length > 0}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Voter ID</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Name</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Constituency</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Registration Date</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <span>Status</span>
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedVoters.length > 0 ? (
                  paginatedVoters.map((voter) => (
                    <tr key={voter.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 pl-0">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedVoters.includes(voter.id)}
                            onChange={() => handleSelectVoter(voter.id)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{voter.id}</td>
                      <td className="px-4 py-3">{voter.name}</td>
                      <td className="px-4 py-3">{voter.constituency}</td>
                      <td className="px-4 py-3">{voter.registrationDate}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            voter.status === "Verified"
                              ? "success"
                              : voter.status === "Pending"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {voter.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 pr-0 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => viewVoterDetails(voter)}
                          >
                            <span className="sr-only">View details</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => confirmDelete(voter)}
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
                        <User className="h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-gray-500">No voters found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredVoters.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredVoters.length)} of {filteredVoters.length} voters
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
                Are you sure you want to delete voter "{voterToDelete?.name}" with ID {voterToDelete?.id}? This action
                cannot be undone.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteVoter}>
                Delete Voter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Voter Details Modal */}
      {showVoterDetails && selectedVoterDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Voter Details</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowVoterDetails(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Personal Information</h4>
                <div className="space-y-2 rounded-lg border p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Voter ID:</span>
                    <span className="text-sm text-gray-900">{selectedVoterDetails.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <span className="text-sm text-gray-900">{selectedVoterDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Aadhaar:</span>
                    <span className="text-sm text-gray-900">{selectedVoterDetails.aadhaar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                    <span className="text-sm text-gray-900">{selectedVoterDetails.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Gender:</span>
                    <span className="text-sm text-gray-900">{selectedVoterDetails.gender}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-gray-900">Contact Information</h4>
                <div className="space-y-2 rounded-lg border p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <span className="text-sm text-gray-900">{selectedVoterDetails.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <span className="text-sm text-gray-900">{selectedVoterDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Address:</span>
                    <span className="text-sm text-right text-gray-900">{selectedVoterDetails.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-gray-900">Voting Information</h4>
                <div className="space-y-2 rounded-lg border p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Constituency:</span>
                    <span className="text-sm text-gray-900">{selectedVoterDetails.constituency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Polling Station:</span>
                    <span className="text-sm text-gray-900">{selectedVoterDetails.pollingStation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Registration Date:</span>
                    <span className="text-sm text-gray-900">{selectedVoterDetails.registrationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <Badge
                      variant={
                        selectedVoterDetails.status === "Verified"
                          ? "success"
                          : selectedVoterDetails.status === "Pending"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {selectedVoterDetails.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-gray-900">Actions</h4>
                <div className="space-y-2 rounded-lg border p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Check className="mr-2 h-4 w-4" />
                      Verify
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setShowVoterDetails(false)
                        confirmDelete(selectedVoterDetails)
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowVoterDetails(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

