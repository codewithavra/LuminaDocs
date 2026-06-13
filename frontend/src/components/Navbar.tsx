import type React from "react"
import { Link } from "react-router"

const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav className="flex h-fit w-full items-center justify-between border-b bg-background/80 p-3 backdrop-blur-2xl">
      <div className="flex items-center justify-center gap-2 text-2xl font-extrabold text-foreground md:text-3xl">
        <Link to="/" className="flex w-fit items-center justify-center gap-2">
          <div className="h-8 w-8 p-0">
            <img
              src="/icon.svg"
              alt="logo"
              className="h-full w-full object-contain"
            />
          </div>

          <p className="logo-text text-2xl md:text-3xl">Lumina</p>
        </Link>
      </div>
      {children}
    </nav>
  )
}

export default Navbar
