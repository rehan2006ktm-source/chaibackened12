import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import mongoose from "mongoose"
import { Video } from "../models/video.model.js";

//banda logged in hona chahiye 

const getVideoComment=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!videoId){
        throw new apierror(400,"video url does not exist")
    }
    
})


const addComment=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id)
    if(!user){
        throw new apierror(400,"user not authenticated ")
    }
    const {videoId}=req.params
    if(!videoId){
        throw new apierror(400,"videoid  not found")
    }
    const isvideoexisted=await Video.findById(videoId)
    if(!isvideoexisted){
        throw new apierror(400,"video not found")
    }
    const {content}=req.body
    if(!content){
         throw new apierror(400,"empty content")
    }
    const comment =await Comment.create({
        content,
        videoId,
        owner:user._id

    })
    return res.status(200).json(
        new apiresponse(200,comment,"Comment has been created")
    )



})


const updateComment=asyncHandler(async(req,res)=>{

    const user=await User.findById(req.user._id)
    if(!user){
        throw new apierror(400,"user not authenticated ")
    }

    const{commentId}=req.params
    if(!commentId){
        throw new apierror(400,"commentid not found")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new apierror(400,"comment not found")
    }
    if(comment.owner.toString()!=user._id.toString()){
        throw new apierror(400,"cant update comment")
    }
    const{newContent}=req.body
    if(!newContent){
        throw new apierror(400,"updatecomment not found")
    }
    comment.content=newContent
    await comment.save({validateBeforeSave:false})

    res.status(200).json(
        new apiresponse(200,{},"comment update successfully")
    )
    
    
})



const deleteComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    if(!commentId){
        throw new apierror(400,"commentid doesnot exist")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new apierror(400,"comment does not exist")
    }
    if(comment.owner.toString()!==req.user._id.toString()){
        throw new apierror(400,"cant delete comment ")
    }
    const dcomment=await Comment.findByIdAndDelete(commentId)
    res.status(200).json(
    new apiresponse(200,dcomment,"comment deleted successfully")
   )

   })
   

export {addComment,
    updateComment,
    deleteComment,
    getVideoComment}