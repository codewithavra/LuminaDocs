import { useTheme } from "./theme-provider"

/**
 * 
 * Component
 */
export const ThemeToggler = () => {
    const { theme, setTheme } = useTheme()
    const toggleTheme = ()=>{
        setTheme(theme === "dark" ? "light" : "dark")
    }
  return (
    <button onClick={toggleTheme} className="w-fit h-fit bg-muted-foreground">{theme}</button>
  )
}

