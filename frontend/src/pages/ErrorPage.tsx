import { useNavigate } from "react-router";


const ErrorPage = () => {
    const navigate = useNavigate()
  return (
    <div className="h-svh w-screen bg-background  flex justify-center items-center" >
        <div className="text-foreground gap-8 px-4 flex flex-col justify-center items-center">
            <p className="text-9xl font-extrabold text-shadow-md text-shadow-cyan-400">404</p>
            <p className="uppercase font-extrabold text-3xl">page not found</p>
            <p className="text-center">The page you are looking for might have been removed or had its name changed or is temporarily unavailable</p>
            <button onClick={()=>navigate(-1)} className="bg-foreground text-background  px-4 py-2 rounded-2xl ">Go Back</button>
        </div>
    </div>
  )
}

export default ErrorPage