/**
 * Node imports
 */

import e from "express";
import cors from 'cors'

/**
 * Other Imports
 */
import { env } from "./config";


const app = e()


/**
 * Routes
 */
app.use('/', (req,res)=>{
    res.send('hi')
})

/**
 * Middlewares
 */
app.use(e.json({
    limit : '10kb',
}))
app.use(e.urlencoded({
    extended : true,
    limit : '10kb'
}))

app.use(cors({
    credentials : true,
    origin : env.CORS_ORIGIN
}))

export default app