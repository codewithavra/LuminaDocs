import Footer from "./Footer"

/**
 *
 * Icons
 */
import { FaPlus, FaArrowUp } from "react-icons/fa6"
import SelectPersona from "./SelectPersona"

const TextBox = () => {
  return (
    <div className="fixed bottom-0 left-1/2 z-30 flex h-fit w-full max-w-2xl -translate-x-1/2 flex-col items-center justify-center p-3">
      {/* Input Area */}
      <div className="flex h-fit w-full flex-col items-center justify-center rounded-3xl bg-card border">
        {/* Text Area */}
        <div className="h-fit w-full pt-2">
          <input type="text" className="size-full p-3 outline-none" />
        </div>

        {/* Operators - PDF input and persona selector */}

        <div className="flex h-fit w-full items-center justify-between p-3">
          {/* Take pdf as input */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
            <FaPlus />
          </div>
          {/* Persona Selector */}
          <div className="ml-auto">
            <SelectPersona />
          </div>

          {/* Submit Button */}
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-background transition-colors duration-50 ease-in-out hover:bg-orange-600">
            <FaArrowUp />
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default TextBox
