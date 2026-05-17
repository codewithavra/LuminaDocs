import { ModeToggle } from "@/components/mode-toggle"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { UserButton } from "@clerk/react"
import { useState } from "react"
import { IoIosAddCircleOutline } from "react-icons/io"

const HomePage = () => {
  const [rmode, setRmode] = useState<boolean>(false)
  return (
    <div
      className={`flex h-svh w-screen items-center justify-center text-foreground dark:bg-background ${rmode ? "bg-amber-50" : "bg-background"}`}
    >
      <div className="flex h-full w-full max-w-6xl flex-col items-center justify-between border-x">
        <div className="h-fit w-full">
          <Navbar>
            <div className="flex h-fit w-fit items-center justify-center gap-4">
              <Button
                variant={rmode ? "default" : "outline"}
                onClick={() => setRmode((prev) => !prev)}
                className="hidden md:block"
              >
                Reading Mode : {rmode ? "ON" : "OFF"}
              </Button>
              <ModeToggle />
              <UserButton />
            </div>
          </Navbar>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-end p-3 pb-4 md:p-4">
          <div className="flex h-15 w-full items-center justify-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="h-full w-fit">
                  <label
                    className="flex aspect-square h-[70%] cursor-pointer items-center justify-center rounded-full text-muted-foreground"
                    htmlFor="fileUpload"
                  >
                    <IoIosAddCircleOutline className="h-[95%] w-auto" />
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    id="fileUpload"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0]
                        if (file) {
                          const formdata = new FormData()
                          formdata.append("pdf", file)
                          await fetch("http://localhost:8000/upload/pdf", {
                            method: "POST",
                            body: formdata,
                          })
                          console.log("file uploaded")
                        }
                      }
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>Add PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              placeholder="ask question"
              className="min-h-15 rounded-3xl border-2 px-4"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
