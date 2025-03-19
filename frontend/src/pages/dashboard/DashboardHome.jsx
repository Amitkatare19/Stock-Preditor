import React from "react"
import { Link } from "react-router-dom"
import { AlertCircle, Calendar, ChevronRight, Clock, FileText, MapPin, QrCode, Shield, User } from "lucide-react"

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

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

// Progress component
const Progress = React.forwardRef(({ className, value, max = 100, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

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

export default function DashboardHome() {
  // Calculate days until next election
  const daysUntilElection = 28 // Mock data
  const userData = JSON.parse(sessionStorage.getItem("userData") || "{}")

  // Quick action items
  const quickActions = [
    {
      title: "View QR Code",
      icon: QrCode,
      path: "/dashboard/profile",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Find Polling Station",
      icon: MapPin,
      path: "/dashboard/polling-map",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "View Documents",
      icon: FileText,
      path: "/dashboard/documents",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Help & Support",
      icon: AlertCircle,
      path: "/dashboard/help",
      color: "bg-purple-100 text-purple-600",
    },
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
  ]

  return (
    <div className="p-4 md:p-6">
      {/* Welcome Banner */}
      <div className="relative mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative">
          <h1 className="text-2xl font-bold">Welcome back, {userData.name?.split(" ")[0] || "Voter"}!</h1>
          <p className="mt-2 text-blue-100">
            Your secure voting dashboard provides everything you need for the upcoming elections.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              View Profile
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              to="/dashboard/elections"
              className="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              Upcoming Elections
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Election Countdown Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Next Election</CardTitle>
            <CardDescription className="text-blue-100">General Elections 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">April 15, 2025</p>
                <h3 className="mt-1 text-3xl font-bold">{daysUntilElection} days</h3>
                <p className="mt-1 text-sm text-blue-100">until voting day</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs">
                <span>Preparation</span>
                <span>Election Day</span>
              </div>
              <Progress value={70} max={100} className="h-1.5 bg-white/20" />
            </div>
            <Link
              to="/dashboard/elections/ge2025"
              className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-white/20 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              View Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        {/* Verification Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Document verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md bg-green-50 p-2">
                <div className="flex items-center">
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-800">Aadhaar Verification</span>
                </div>
                <Badge variant="success">Verified</Badge>
              </div>

              <div className="flex items-center justify-between rounded-md bg-green-50 p-2">
                <div className="flex items-center">
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-800">Voter ID</span>
                </div>
                <Badge variant="success">Verified</Badge>
              </div>

              <div className="flex items-center justify-between rounded-md bg-yellow-50 p-2">
                <div className="flex items-center">
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                    <FileText className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-yellow-800">Address Proof</span>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>

              <Link
                to="/dashboard/documents"
                className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Manage Documents
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Polling Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Polling Information</CardTitle>
            <CardDescription>Your assigned polling station</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Government High School, Sector 12</h4>
                    <p className="text-sm text-gray-600">Booth #42</p>
                  </div>
                </div>
                <div className="mt-3 rounded-md bg-white p-3 shadow-sm">
                  <p className="text-sm text-gray-700">Plot No. 15, Sector 12, Gandhinagar, Gujarat - 382016</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Voting Hours: 8:00 AM - 6:00 PM</span>
                </div>
                <Badge variant="secondary">Assigned</Badge>
              </div>

              <Link
                to="/dashboard/polling-map"
                className="inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-white py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                View on Map
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="group flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
          >
            <div
              className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${action.color} transition-transform group-hover:scale-110`}
            >
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.title}</span>
          </Link>
        ))}
      </div>

      {/* Upcoming Elections Section */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Elections</h2>
          <Link
            to="/dashboard/elections"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {upcomingElections.map((election) => (
            <Link
              key={election.id}
              to={`/dashboard/elections/${election.id}`}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{election.title}</h4>
                  <Badge variant="warning">Upcoming</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{election.date}</span>
                  </div>
                  <Badge variant="secondary">{election.type}</Badge>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Days remaining:</span>
                  <span className="font-medium text-blue-600">{election.daysLeft} days</span>
                </div>

                <Progress value={100 - (election.daysLeft / 120) * 100} max={100} className="mt-2 h-1.5 bg-gray-100" />

                <div className="mt-4 text-right">
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 transition-all group-hover:translate-x-1">
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Important Information */}
      <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-medium text-yellow-800">Important Information</h3>
            <p className="mt-1 text-sm text-yellow-700">
              Make sure your documents are up to date before the election. Verify your polling station location and
              bring your voter ID on election day.
            </p>
            <div className="mt-3">
              <Link
                to="/dashboard/help"
                className="inline-flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900 hover:underline"
              >
                Learn More
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

