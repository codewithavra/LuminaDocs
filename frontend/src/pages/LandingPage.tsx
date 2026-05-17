import Footer from "@/components/Footer"
import { ModeToggle } from "@/components/mode-toggle"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <div className="flex h-svh w-screen items-center justify-center bg-background text-foreground">
      <div className="flex h-full w-full max-w-6xl flex-col items-center justify-between gap-4 md:border-x">
        <div className="h-fit w-full">
          <Navbar>
            <div className="w-fit gap-2 flex justify-center items-center">
              <ModeToggle />
              <Button variant={"outline"} onClick={() => navigate("/auth")}>
                Sign in
              </Button>
            </div>
          </Navbar>
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
        <div className="h-fit w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default LandingPage
