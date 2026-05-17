import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar"
import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div className="flex h-svh w-screen items-center justify-center bg-background text-foreground">
      <div className="flex h-full w-full max-w-6xl flex-col items-center justify-between md:border-x gap-4">
        <div className="h-fit w-full">
          <Navbar>
            <div className="rounded-2xl bg-foreground px-4 py-2 text-background"><Link to="/auth">Sign in</Link></div>
          </Navbar>
        </div>
        <div className="h-fit w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default LandingPage
