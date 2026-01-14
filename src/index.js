import dotenv from "dotenv"
//import mongoose from"mongoose"
//import {DB_NAME} from "./constant"
import connectDB from "./db/index.js"
import express from"express"
const app=express()
dotenv.config({
    path:"./env"
})

connectDB()
.then(()=>{
   const server = app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`server is listening on the port : ${process.env.PORT}`);
    })
    server.on("error",()=>{
         console.log("ERR:",error)
         throw error
      
    })
})
.catch((error)=>{
    console.log("MONGO db connection failed",error);
})















/* isme sbko ek hi file me likh diya 
import express from "express"

const app=express()

(  async () => {
    try{
       await mongoose.connect(`$(process.env.MONGODB_URI)/$(DB_NAME)`)
       app.on("error",(error)=>{
        console.log("ERR:",error)
        throw error
       })

       app.listen(process.env.PORT,()=>{
        console.log(`app is listening on the ${process.env.port}`);
       })
    } 
    catch(error){
        console.log("ERROR",error);
        throw error;
    }
})()
    */