
import type React from "react"
import { GiBookAura } from "react-icons/gi"
import { Link } from "react-router";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav className="flex h-fit w-full items-center justify-between border-b bg-background/80 p-3 backdrop-blur-2xl md:p-4">
      <div className="flex items-center justify-center gap-2 text-2xl font-extrabold text-foreground md:text-3xl">
        <Link to="/" className="flex items-center gap-2 justify-center w-fit">
          <GiBookAura />
          <p>LuminaDocs</p>
        </Link>
      </div>
      {children}
    </nav>
  )
}

export default Navbar
