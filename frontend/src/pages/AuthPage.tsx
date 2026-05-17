import Loader from "@/components/Loader";
import { SignIn, useAuth } from "@clerk/react";
import { Navigate } from "react-router";


const AuthPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if(!isLoaded) return <Loader />
  if(isSignedIn) return <Navigate to="/home" />
  return (
    <div className="h-svh w-screen bg-background text-foreground justify-center flex items-center">
      <SignIn  forceRedirectUrl="/home"/>
    </div>
  )
}

export default AuthPage