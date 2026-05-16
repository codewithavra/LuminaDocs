
import Loader from "@/components/Loader";
import { useAuth } from "@clerk/react-router"
import React from "react"
import { Navigate } from "react-router"

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const useauth = useAuth()
  const isSignedin = useauth.isSignedIn
  const isLoaded = useauth.isLoaded

  if (!isLoaded) return <Loader />
  if (!isSignedin) return <Navigate to="/auth" />
  return children
}

export default ProtectedRoutes
