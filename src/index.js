import dotenv from "dotenv"
//import mongoose from"mongoose"
//import {DB_NAME} from "./constant"
import connectDB from "./db/index.js"
import {app} from "./app.js"  

dotenv.config({
    path:"./.env"
})

connectDB()
.then(()=>{
    
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`server is listening on the port : ${process.env.PORT}`);
    })
    // server.on("error",(error)=>{
    //    //  console.log("ERR:",error)
    //      throw error
      
    // })
})
.catch((err)=>{
    console.log("MONGO db connection failed",err);
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