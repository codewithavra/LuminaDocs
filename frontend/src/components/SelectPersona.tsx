/**
 * Hooks
 */

import { usePersonaStore } from "@/store/personaStore"
import type { Persona } from "@/Types";
import { useState } from "react";

/**
 * 
 * Icons
 */

import { FaAngleDown } from "react-icons/fa";

const SelectPersona = () => {
    const personas : Persona[] = ['Beginner', 'Intermediate', 'Expert']
  const currentPersona = usePersonaStore((state) => state.persona)
  const setCurrentPersona = usePersonaStore((state) => state.setPersona)

  const [open, setOpen] = useState<boolean>(false)
  return (
    <div className="flex justify-end items-center px-2 select-none">
    <div className="hover:bg-background w-fit h-fit px-3 py-1 flex gap-2 justify-center items-center rounded-md cursor-pointer relative" onClick={()=>setOpen(prev=>!prev)}>
        <p>{currentPersona}</p>
        <FaAngleDown />
        {
            open && <div className="absolute z-40 bottom-full right-0 size-fit border space-y-2 pr-8 pl-4 py-2 bg-card/90 rounded-2xl" >
                { personas.map((item,idx)=>{
                    return <div key={idx} onClick={()=>setCurrentPersona(item)} className="border-b hover:text-orange-600 transition-colors duration-50 ease-in-out">
                        {item}
                    </div>
                })}
            </div>
        }
    </div>

    </div>
  )

}

export default SelectPersona
