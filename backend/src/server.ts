/**
 * Node modules
 */
import "dotenv/config";

/**
 * Other imports
 */
import { app } from "./app";
import { env } from "./config/env";


app.listen(env.PORT,()=>{
    console.log(`Backend is running @http://localhost:${env.PORT}`)
})