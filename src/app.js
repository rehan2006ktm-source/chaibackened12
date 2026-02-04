import dotenv from "dotenv"

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config({
    path:"./.env"
})

const app=express() 


app.use(cors({
    origin: process.env.CORS_ORIGIN,
     credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())



//routes
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users",userRouter)

import commentRouter from "./routes/comment.routes.js";


console.log("something")
app.use("/api/v1/comments",commentRouter)
//https://localhost:5000/api/v1/users/register



export {app}