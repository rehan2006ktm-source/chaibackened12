import mongoose from "mongoose"

const likeSchema=new mongoose.Schema({
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    tweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tweet"
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }


},{timestamps:true})

export const Like=mongoose.model("Like",likeSchema)


/*
import mongoose from "mongoose"

const likeSchema=new mongoose.Schema({},{timestamps:true})

export const Like=mongoose.model("Like",likeSchema)

*/