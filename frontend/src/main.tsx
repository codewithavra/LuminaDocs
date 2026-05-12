import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { ClerkProvider } from "@clerk/react"

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ClerkProvider publishableKey={key}>
        <App />
      </ClerkProvider>
    </ThemeProvider>
  </StrictMode>
)
