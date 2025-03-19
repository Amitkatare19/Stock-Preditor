import { Link } from "react-router-dom"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-1">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900">404</h1>
        <p className="text-xl font-semibold text-gray-900">Page Not Found</p>
        <p className="mt-2 text-gray-600">The page you are looking for doesn't exist or has been moved.</p>

        <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-center sm:space-x-4 sm:space-y-0">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:from-blue-700 hover:to-purple-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

