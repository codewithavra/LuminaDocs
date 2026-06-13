/**
 * Node Imports
 */
import { create } from 'zustand'

/**
 * Types
 */
import type { Persona } from '@/Types';



interface PersonaStore {
    persona : Persona;
    setPersona : (persona: Persona)=>void
}

export const usePersonaStore = create<PersonaStore>((set)=>({
    persona : 'Beginner',
    setPersona : (newPersona) => set({persona : newPersona}),
}))