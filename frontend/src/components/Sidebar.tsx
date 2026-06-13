/**
 * Node Imports
 */
import React, { useState } from "react"

/**
 * Icons
 */
import { FaRegPenToSquare } from "react-icons/fa6"
import { GrMenu } from "react-icons/gr"
import { CgCloseR } from "react-icons/cg"

/**
 * Components
 */
import { UserButton, useUser } from "@clerk/react"

const Sidebar = ({
  newChatFunc,
}: {
  newChatFunc?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [isClosed, setIsClosed] = useState<boolean>(true)
  const user = useUser().user
  return (
    <div className="fixed top-0 left-0 z-50">
      {isClosed === true ? (
        <div className="flex h-fit md:h-svh w-fit flex-col items-center justify-start md:border-r p-2 text-base text-foreground/80">

          {/* upper section when sidebar is closed */}
          <div className="group relative flex h-8 w-8 items-center justify-center p-2 cursor-ew-resize mx-auto mt-0.5">
            {/* Logo */}
            <div className="absolute inset-0 size-full p-0 opacity-100 transition-opacity duration-100 group-hover:opacity-0 md:block cursor-ew-resize">
              <img
                src="/icon.svg"
                alt="logo"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setIsClosed(false)}
              className="absolute inset-0 rounded-sm p-2 opacity-0 transition-opacity duration-100 group-hover:opacity-100 hover:bg-muted-foreground/40 cursor-ew-resize"
            >
              <GrMenu />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => newChatFunc}
            className="hidden rounded-sm p-2 hover:bg-muted-foreground/40 md:block mt-2"
          >
            <FaRegPenToSquare />
          </button>

          {/* user section */}
          <div className="hidden hover:bg-muted-foreground/40 md:flex md:justify-center md:items-center mt-auto rounded-full">
            <UserButton />
          </div>
        </div>
      ) : (
        <div className="flex h-svh w-65 flex-col items-center justify-between border-r bg-background p-2 text-foreground">
          {/* Top section */}
          <div className="flex h-fit w-full items-center justify-between text-foreground/80">
            <div className="h-8 w-fit p-0 flex justify-center items-center gap-2">
              <img
                src="/icon.svg"
                alt="logo"
                className="h-full w-8 object-contain"
              />
              <p className="logo-text text-2xl md:text-3xl">Lumina</p>
            </div>
            <button
              onClick={() => setIsClosed(true)}
              className="rounded-sm p-2 text-xl hover:bg-muted-foreground/40"
            >
              <CgCloseR />
            </button>
          </div>

          {/* New Chat section */}

          {/* History Section */}

          {/* Bottom Section */}
          <div className="w-full hover:bg-muted-foreground/40 h-fit p-2 flex justify-start items-center gap-2  border-t ">
            <UserButton />
            <p className="text-lg">{user?.firstName}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
