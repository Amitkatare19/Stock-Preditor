"use client"

import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertCircle,
  Check,
  ChevronRight,
  HelpCircle,
  Info,
  Shield,
  Vote,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  X,
  ChevronDown,
  Eye,
  Sparkles,
  Loader2,
} from "lucide-react"

// Simple utility function for combining class names without dependencies
const cn = (...classes) => {
  return classes
    .filter(Boolean)
    .join(" ")
    .replace(/border-border/g, "border")
}

// UI Components
const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "button" : "button"

    let variantClasses = ""
    if (variant === "default") variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90"
    else if (variant === "destructive")
      variantClasses = "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    else if (variant === "outline")
      variantClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    else if (variant === "secondary") variantClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    else if (variant === "ghost") variantClasses = "hover:bg-accent hover:text-accent-foreground"
    else if (variant === "link") variantClasses = "text-primary underline-offset-4 hover:underline"
    else if (variant === "indigo") variantClasses = "bg-indigo-600 text-white hover:bg-indigo-700"
    else if (variant === "purple") variantClasses = "bg-purple-600 text-white hover:bg-purple-700"

    let sizeClasses = ""
    if (size === "default") sizeClasses = "h-10 px-4 py-2"
    else if (size === "sm") sizeClasses = "h-9 rounded-md px-3"
    else if (size === "lg") sizeClasses = "h-11 rounded-md px-8"
    else if (size === "icon") sizeClasses = "h-10 w-10"

    if (asChild) {
      return <React.Fragment ref={ref} {...props} />
    }

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

// Badge component
const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-primary/10 text-primary hover:bg-primary/20",
    secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    indigo: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantClasses[variant] || variantClasses.default,
        className,
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

// Tooltip component
const Tooltip = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false)
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 w-max max-w-xs rounded-md bg-black px-3 py-1.5 text-xs text-white animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
            positionClasses[position],
          )}
        >
          {content}
          <div
            className={cn(
              "absolute h-2 w-2 rotate-45 bg-black",
              position === "top" && "top-full left-1/2 -translate-x-1/2 -translate-y-1/2",
              position === "bottom" && "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2",
              position === "left" && "left-full top-1/2 -translate-x-1/2 -translate-y-1/2",
              position === "right" && "right-full top-1/2 translate-x-1/2 -translate-y-1/2",
            )}
          />
        </div>
      )}
    </div>
  )
}

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-300"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

// Progress bar component
const ProgressBar = ({ value, max, className }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}>
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

// Session timer component
const SessionTimer = ({ duration = 300, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, onExpire])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex items-center space-x-1.5 text-sm">
      <Clock className="h-3.5 w-3.5" />
      <span
        className={cn(
          "font-medium",
          timeLeft < 60 ? "text-red-500" : timeLeft < 120 ? "text-yellow-500" : "text-gray-500",
        )}
      >
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  )
}

export default function VotingPage() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [voteSubmitted, setVoteSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCandidateDetails, setShowCandidateDetails] = useState(false)
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState(null)
  const [showSecurityInfo, setShowSecurityInfo] = useState(false)
  const [voteReceipt, setVoteReceipt] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showQRCode, setShowQRCode] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Check if user has already voted
  useEffect(() => {
    const hasVoted = sessionStorage.getItem("hasVoted") === "true"
    if (hasVoted) {
      navigate("/dashboard")
    }
  }, [navigate])

  // Animated elements
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    candidates: false,
    controls: false,
  })

  // Check if user is verified
  useEffect(() => {
    const isVerified = sessionStorage.getItem("voteVerified")
    if (!isVerified) {
      navigate("/voting/verify")
      return
    }

    // Load user data
    try {
      const storedUserData = sessionStorage.getItem("userData")
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }

    // Load candidates
    loadCandidates()

    // Start animations
    setTimeout(() => setAnimatedElements((prev) => ({ ...prev, header: true })), 100)
    setTimeout(() => setAnimatedElements((prev) => ({ ...prev, candidates: true })), 300)
    setTimeout(() => setAnimatedElements((prev) => ({ ...prev, controls: true })), 500)
  }, [navigate])

  // Load candidates (mock data for demo)
  const loadCandidates = () => {
    const mockCandidates = [
      {
        id: 1,
        name: "Rajesh Kumar",
        party: "National Democratic Alliance",
        partyShort: "NDA",
        symbol: "🌷", // Lotus symbol
        image: "/placeholder.svg?height=100&width=100",
        color: "bg-orange-100 border-orange-300",
        buttonColor: "bg-indigo-600 hover:bg-indigo-700",
        category: "national",
        details: {
          age: 52,
          education: "Ph.D. in Public Policy",
          experience: "15 years as Member of Parliament",
          achievements: [
            "Led infrastructure development projects worth ₹500 crore",
            "Authored 3 major policy reforms in education sector",
            "Increased constituency development index by 25%",
          ],
          manifesto: [
            "Infrastructure development in rural areas",
            "Job creation through manufacturing sector",
            "National security enhancement",
            "Digital India initiatives",
          ],
          socialMedia: {
            twitter: "@rajeshkumar",
            facebook: "rajeshkumarofficial",
            instagram: "rajesh.kumar.official",
          },
        },
      },
      {
        id: 2,
        name: "Priya Sharma",
        party: "United Progressive Alliance",
        partyShort: "UPA",
        symbol: "✋", // Hand symbol
        image: "/placeholder.svg?height=100&width=100",
        color: "bg-blue-100 border-blue-300",
        buttonColor: "bg-indigo-600 hover:bg-indigo-700",
        category: "national",
        details: {
          age: 48,
          education: "Master's in Economics",
          experience: "Former State Minister, 10 years in politics",
          achievements: [
            "Implemented universal healthcare program in her state",
            "Reduced gender gap in education by 15%",
            "Established 50 women's empowerment centers",
          ],
          manifesto: [
            "Universal healthcare access",
            "Education reforms and scholarships",
            "Women's empowerment programs",
            "Environmental protection policies",
          ],
          socialMedia: {
            twitter: "@priyasharma",
            facebook: "priyasharmaofficial",
            instagram: "priya.sharma.official",
          },
        },
      },
      {
        id: 3,
        name: "Amit Patel",
        party: "Regional People's Front",
        partyShort: "RPF",
        symbol: "🚲", // Bicycle symbol
        image: "/placeholder.svg?height=100&width=100",
        color: "bg-green-100 border-green-300",
        buttonColor: "bg-indigo-600 hover:bg-indigo-700",
        category: "regional",
        details: {
          age: 45,
          education: "Law Degree",
          experience: "Grassroots activist, 8 years as MLA",
          achievements: [
            "Secured water rights for 200 villages",
            "Led farmers' movement for fair crop prices",
            "Established 25 rural development centers",
          ],
          manifesto: [
            "Regional autonomy and development",
            "Agricultural subsidies and farmer support",
            "Local language and cultural preservation",
            "Water resource management",
          ],
          socialMedia: {
            twitter: "@amitpatel",
            facebook: "amitpatelofficial",
            instagram: "amit.patel.official",
          },
        },
      },
      {
        id: 4,
        name: "Sunita Reddy",
        party: "Progressive Democratic Party",
        partyShort: "PDP",
        symbol: "🔔", // Bell symbol
        image: "/placeholder.svg?height=100&width=100",
        color: "bg-purple-100 border-purple-300",
        buttonColor: "bg-indigo-600 hover:bg-indigo-700",
        category: "regional",
        details: {
          age: 39,
          education: "MBA and Social Work",
          experience: "NGO founder, 5 years in politics",
          achievements: [
            "Launched tech education program reaching 10,000 students",
            "Created urban housing initiative for 5,000 families",
            "Established innovation hub creating 2,000 jobs",
          ],
          manifesto: [
            "Universal basic income pilot programs",
            "Technology sector development",
            "Healthcare modernization",
            "Urban housing and transportation",
          ],
          socialMedia: {
            twitter: "@sunitareddy",
            facebook: "sunitareddyofficial",
            instagram: "sunita.reddy.official",
          },
        },
      },
      {
        id: 5,
        name: "Vikram Singh",
        party: "People's Democratic Front",
        partyShort: "PDF",
        symbol: "🌟", // Star symbol
        image: "/placeholder.svg?height=100&width=100",
        color: "bg-yellow-100 border-yellow-300",
        buttonColor: "bg-indigo-600 hover:bg-indigo-700",
        category: "independent",
        details: {
          age: 41,
          education: "Civil Engineering & Public Administration",
          experience: "Civil servant for 12 years, Independent candidate",
          achievements: [
            "Led urban renewal projects in 3 major cities",
            "Implemented transparent governance systems",
            "Reduced bureaucratic processes by 30%",
          ],
          manifesto: [
            "Administrative reforms and transparency",
            "Smart city initiatives",
            "Youth employment programs",
            "Anti-corruption measures",
          ],
          socialMedia: {
            twitter: "@vikramsingh",
            facebook: "vikramsinghofficial",
            instagram: "vikram.singh.official",
          },
        },
      },
      {
        id: 6,
        name: "Meera Desai",
        party: "Independent",
        partyShort: "IND",
        symbol: "📝", // Pencil symbol
        image: "/placeholder.svg?height=100&width=100",
        color: "bg-gray-100 border-gray-300",
        buttonColor: "bg-indigo-600 hover:bg-indigo-700",
        category: "independent",
        details: {
          age: 36,
          education: "Journalism and Political Science",
          experience: "Journalist, Social Activist, First-time candidate",
          achievements: [
            "Award-winning investigative journalist",
            "Led citizen movements for environmental protection",
            "Founded education initiative for underprivileged children",
          ],
          manifesto: [
            "Media freedom and right to information",
            "Environmental sustainability",
            "Education for all",
            "Grassroots democracy strengthening",
          ],
          socialMedia: {
            twitter: "@meeradesai",
            facebook: "meeradesaiofficial",
            instagram: "meera.desai.official",
          },
        },
      },
    ]

    setCandidates(mockCandidates)

    // Simulate loading progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setLoadingProgress(progress)
      if (progress >= 100) clearInterval(interval)
    }, 100)
  }

  // Filter candidates based on active tab and search term
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesTab = activeTab === "all" || candidate.category === activeTab
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.party.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Select a candidate
  const selectCandidate = (candidate) => {
    setSelectedCandidate(candidate)
    // Add subtle haptic feedback if supported
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
  }

  // View candidate details
  const viewCandidateDetails = (candidate) => {
    setSelectedCandidateDetails(candidate)
    setShowCandidateDetails(true)
  }

  // Submit vote
  const submitVote = () => {
    if (!selectedCandidate) {
      setError("Please select a candidate before submitting your vote.")
      setTimeout(() => setError(null), 3000)
      return
    }

    setShowConfirmation(true)
  }

  // Confirm vote
  const confirmVote = () => {
    setIsVoting(true)
    setShowConfirmation(false)

    // Simulate API call to submit vote
    setTimeout(() => {
      // Generate a vote receipt
      const receipt = {
        id: Math.random().toString(36).substring(2, 15),
        timestamp: new Date().toISOString(),
        constituency: userData?.constituency || "Central Delhi",
        boothId: "B" + Math.floor(1000 + Math.random() * 9000),
        verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
        electionId: "GE2025-" + Math.floor(10000 + Math.random() * 90000),
      }

      setVoteReceipt(receipt)
      setVoteSubmitted(true)
      setIsVoting(false)
      setShowSuccessAnimation(true)

      // Store vote status in session
      sessionStorage.setItem("hasVoted", "true")
      // Store vote timestamp
      sessionStorage.setItem("voteTimestamp", new Date().toISOString())
      // Store receipt in session storage for reference
      sessionStorage.setItem("voteReceipt", JSON.stringify(receipt))

      // Hide success animation after 3 seconds
      setTimeout(() => setShowSuccessAnimation(false), 3000)
    }, 2000)
  }

  // Toggle help section
  const toggleHelp = () => {
    setShowHelp((prev) => !prev)
  }

  // Toggle security info
  const toggleSecurityInfo = () => {
    setShowSecurityInfo((prev) => !prev)
  }

  // Toggle QR code
  const toggleQRCode = () => {
    setShowQRCode((prev) => !prev)
  }

  // Session expired handler
  const handleSessionExpired = () => {
    setSessionExpired(true)
  }

  // Return to dashboard
  const returnToDashboard = () => {
    navigate("/dashboard")
  }

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters((prev) => !prev)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div
          className={cn(
            "transform transition-all duration-700 ease-out",
            animatedElements.header ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div>
              <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-left">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Cast Your Vote
                </span>
              </h1>
              <p className="mt-2 text-center text-sm text-gray-600 sm:text-left">
                General Elections 2025 - {userData?.constituency || "Your Constituency"}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <SessionTimer duration={600} onExpire={handleSessionExpired} />

              <button
                onClick={toggleHelp}
                className="rounded-full bg-white p-2 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-700"
                aria-label="Help"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* User info summary */}
          {userData && (
            <div className="mt-4">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userData.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Voter ID: {userData.voterID}</span>
                        <span>•</span>
                        <Tooltip content="Your registered constituency">
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3.5 w-3.5" />
                            <span>{userData.constituency || "Central Delhi"}</span>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <Badge variant="indigo" className="animate-pulse">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    <span>Voting in progress</span>
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          className={cn(
            "transform transition-all duration-700 ease-out",
            animatedElements.candidates ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <Card className="overflow-hidden border-none bg-white/90 shadow-xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-50" />
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10 blur-3xl" />

            <CardHeader className="relative space-y-1 border-b border-gray-100 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
                  <Vote className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleSecurityInfo}
                    className="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                    aria-label="Security Information"
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleHelp}
                    className="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                    aria-label="Help"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <CardTitle className="mt-4 text-2xl font-bold">
                {voteSubmitted ? "Vote Submitted Successfully" : "Select Your Candidate"}
              </CardTitle>
              <CardDescription>
                {voteSubmitted
                  ? "Thank you for participating in the democratic process"
                  : "Choose one candidate from the list below"}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative px-6 pt-6">
              <div className="space-y-6">
                {/* Help section */}
                {showHelp && (
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm">
                    <h4 className="mb-2 flex items-center font-medium text-indigo-800">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Voting Instructions
                    </h4>
                    <div className="space-y-2 text-indigo-700">
                      <p>• Review each candidate's information carefully before making your choice.</p>
                      <p>• Click on a candidate card to select them.</p>
                      <p>• Click "View Details" to see more information about a candidate.</p>
                      <p>• After selecting, click "Submit Vote" to confirm your choice.</p>
                      <p>• You will have one final chance to confirm before your vote is recorded.</p>
                      <p>• Once submitted, your vote cannot be changed.</p>
                    </div>
                    <button onClick={toggleHelp} className="mt-2 text-indigo-600 hover:text-indigo-800 hover:underline">
                      Close Help
                    </button>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                    <AlertCircle className="mr-1 inline-block h-4 w-4" />
                    {error}
                  </div>
                )}

                {!voteSubmitted ? (
                  <>
                    {/* Search and filter */}
                    <div className="mb-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Search candidates or parties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>
                        </div>

                        <button
                          onClick={toggleFilters}
                          className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          <span>Filters</span>
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>

                      {showFilters && (
                        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setActiveTab("all")}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                activeTab === "all"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-white text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              All Candidates
                            </button>
                            <button
                              onClick={() => setActiveTab("national")}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                activeTab === "national"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-white text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              National Parties
                            </button>
                            <button
                              onClick={() => setActiveTab("regional")}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                activeTab === "regional"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-white text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              Regional Parties
                            </button>
                            <button
                              onClick={() => setActiveTab("independent")}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                activeTab === "independent"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-white text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              Independents
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Candidates list */}
                    {loadingProgress < 100 ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="mb-2 h-8 w-8 animate-spin text-indigo-500" />
                        <p className="text-sm text-gray-500">Loading candidates...</p>
                        <div className="mt-4 w-64">
                          <ProgressBar value={loadingProgress} max={100} />
                        </div>
                      </div>
                    ) : filteredCandidates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-8">
                        <div className="mb-2 rounded-full bg-gray-100 p-3">
                          <AlertCircle className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700">No candidates found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {filteredCandidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className={cn(
                              "group relative cursor-pointer overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md",
                              selectedCandidate?.id === candidate.id
                                ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-opacity-50"
                                : `${candidate.color} hover:border-gray-300`,
                            )}
                            onClick={() => selectCandidate(candidate)}
                          >
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                  <img
                                    src={candidate.image || "/placeholder.svg"}
                                    alt={candidate.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="mt-2 text-center text-2xl">{candidate.symbol}</div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                                <p className="text-sm text-gray-600">{candidate.party}</p>
                                <p className="text-xs text-gray-500">({candidate.partyShort})</p>
                                <div className="mt-2 flex space-x-2">
                                  <button
                                    type="button"
                                    className="flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      viewCandidateDetails(candidate)
                                    }}
                                  >
                                    <Eye className="mr-1 h-3 w-3" />
                                    View Details
                                  </button>
                                </div>
                              </div>
                              {selectedCandidate?.id === candidate.id && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Security information */}
                    <button
                      onClick={toggleSecurityInfo}
                      className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Voting Security Information</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 text-gray-500 transition-transform ${showSecurityInfo ? "rotate-90" : ""}`}
                      />
                    </button>

                    {showSecurityInfo && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
                        <h5 className="mb-2 font-medium text-gray-700">How We Protect Your Vote</h5>
                        <ul className="space-y-1">
                          <li>• Your vote is encrypted and anonymized</li>
                          <li>• No connection between your identity and your vote is stored</li>
                          <li>• The system uses blockchain technology to prevent tampering</li>
                          <li>
                            • You will receive a verification receipt that you can use to verify your vote was counted
                          </li>
                          <li>• Independent auditors verify the integrity of the voting system</li>
                        </ul>
                      </div>
                    )}

                    {/* Submit button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={submitVote}
                        disabled={!selectedCandidate || isVoting}
                        className="group relative w-full overflow-hidden rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-white transition-all hover:from-indigo-700 hover:to-purple-700 sm:w-auto"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          {isVoting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Submit Vote</>
                          )}
                        </span>
                        <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-indigo-700 to-purple-700 transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
                      </Button>
                    </div>
                  </>
                ) : (
                  // Vote submitted success
                  <div className="space-y-6">
                    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-purple-200 bg-purple-50 p-6">
                      {showSuccessAnimation && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-full w-full animate-pulse bg-purple-400/20"></div>
                          <div className="absolute -inset-10 animate-spin-slow">
                            {[...Array(12)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute h-2 w-2 rounded-full bg-purple-500"
                                style={{
                                  top: `${50 + 45 * Math.sin(i * (Math.PI / 6))}%`,
                                  left: `${50 + 45 * Math.cos(i * (Math.PI / 6))}%`,
                                  opacity: 0.7,
                                  animation: `pulse 1.5s infinite ${i * 0.1}s`,
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 shadow-inner">
                        <CheckCircle2 className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-purple-800">Vote Recorded Successfully</h3>
                      <p className="mt-2 text-center text-sm text-purple-700">
                        Your vote has been securely recorded. Thank you for participating in the democratic process.
                      </p>

                      {/* Vote receipt */}
                      {voteReceipt && (
                        <div className="mt-4 w-full rounded-lg border border-purple-200 bg-white p-4 text-sm shadow-sm">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-medium text-gray-800">Vote Receipt</h4>
                            <button
                              onClick={toggleQRCode}
                              className="flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                            >
                              {showQRCode ? "Hide QR" : "Show QR"}
                            </button>
                          </div>

                          {showQRCode && (
                            <div className="mb-3 flex justify-center">
                              <div className="h-32 w-32 rounded-md bg-white p-2 shadow-sm">
                                {/* Placeholder for QR code */}
                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-500">
                                  QR Code for verification
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2 text-gray-600">
                            <div className="flex justify-between">
                              <span>Receipt ID:</span>
                              <span className="font-medium">{voteReceipt.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Timestamp:</span>
                              <span className="font-medium">{new Date(voteReceipt.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Constituency:</span>
                              <span className="font-medium">{voteReceipt.constituency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Booth ID:</span>
                              <span className="font-medium">{voteReceipt.boothId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Election ID:</span>
                              <span className="font-medium">{voteReceipt.electionId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Verification Code:</span>
                              <span className="font-medium">{voteReceipt.verificationCode}</span>
                            </div>
                          </div>
                          <div className="mt-3 text-center text-xs text-gray-500">
                            You can use this receipt to verify your vote was counted without revealing your choice.
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={returnToDashboard}
                        variant="indigo"
                        className="group relative overflow-hidden rounded-md px-6 py-2 transition-all"
                      >
                        <span className="relative z-10 flex items-center">
                          Return to Dashboard
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </span>
                        <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-indigo-700 to-purple-700 transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="relative mt-4 flex flex-col space-y-2 border-t border-gray-100 bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
              <p className="flex items-center justify-center">
                <Shield className="mr-1 h-3 w-3 text-gray-400" />
                Your vote is confidential and securely processed
              </p>
              <p>
                Having trouble?{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                  Contact election support
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Footer */}
        <div
          className={cn(
            "transform transition-all duration-700 ease-out",
            animatedElements.controls ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <div className="rounded-lg border border-gray-200 bg-white/80 p-4 text-center text-sm text-gray-600 backdrop-blur-sm">
            <p className="flex items-center justify-center">
              <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
              <span>Your vote matters! Thank you for participating in the democratic process.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Candidate details modal */}
      <Modal isOpen={showCandidateDetails} onClose={() => setShowCandidateDetails(false)} title="Candidate Details">
        {selectedCandidateDetails && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-md">
                <img
                  src={selectedCandidateDetails.image || "/placeholder.svg"}
                  alt={selectedCandidateDetails.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-medium">{selectedCandidateDetails.name}</h3>
                <p className="text-gray-600">{selectedCandidateDetails.party}</p>
                <div className="mt-1 text-3xl">{selectedCandidateDetails.symbol}</div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <span className="font-medium text-gray-700">Age: </span>
                <span>{selectedCandidateDetails.details.age} years</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Education: </span>
                <span>{selectedCandidateDetails.details.education}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Experience: </span>
                <span>{selectedCandidateDetails.details.experience}</span>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-gray-800">Key Achievements:</h4>
              <ul className="list-inside list-disc space-y-1 rounded-lg border border-gray-200 bg-white p-3 text-sm">
                {selectedCandidateDetails.details.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-gray-800">Key Manifesto Points:</h4>
              <ul className="list-inside list-disc space-y-1 rounded-lg border border-gray-200 bg-white p-3 text-sm">
                {selectedCandidateDetails.details.manifesto.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowCandidateDetails(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  selectCandidate(selectedCandidateDetails)
                  setShowCandidateDetails(false)
                }}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Select Candidate
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation modal */}
      <Modal isOpen={showConfirmation} onClose={() => setShowConfirmation(false)} title="Confirm Your Vote">
        {selectedCandidate && (
          <div className="space-y-4">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              <div className="flex items-start">
                <Info className="mr-2 h-5 w-5 flex-shrink-0 text-yellow-600" />
                <p>
                  You are about to cast your vote for <strong>{selectedCandidate.name}</strong> of{" "}
                  <strong>{selectedCandidate.party}</strong>. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-3xl">{selectedCandidate.symbol}</div>
              <div>
                <h3 className="font-medium">{selectedCandidate.name}</h3>
                <p className="text-sm text-gray-600">{selectedCandidate.party}</p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Please confirm that this is your intended choice. Once submitted, your vote cannot be changed.
            </p>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Go Back
              </button>
              <button
                onClick={confirmVote}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Confirm Vote
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Session expired modal */}
      <Modal isOpen={sessionExpired} onClose={() => {}} title="Session Expired">
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <div className="flex items-start">
              <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0 text-red-600" />
              <p>
                Your voting session has expired due to inactivity. For security reasons, you will need to verify your
                identity again.
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => navigate("/voting/verify")}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Verify Identity Again
            </button>
          </div>
        </div>
      </Modal>

      {/* Add custom CSS for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
            100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
          }
          
          .pulse {
            animation: pulse 2s infinite;
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }
        `,
        }}
      />
    </div>
  )
}

