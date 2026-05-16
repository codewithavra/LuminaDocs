import AuthPage from "@/pages/AuthPage"
import ErrorPage from "@/pages/ErrorPage";
import HomePage from "@/pages/HomePage"
import LandingPage from "@/pages/LandingPage"
import ProtectedRoutes from "@/utils/ProtectedRoutes"
import { Route, Routes } from "react-router"

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoutes>
            <HomePage />
          </ProtectedRoutes>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default AppRouter
