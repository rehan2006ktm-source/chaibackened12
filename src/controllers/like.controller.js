import {asyncHandler} from "../utils/asynchandler.js"
import {apierror} from "../utils/apierror.js"
import {Like} from "../models/like.model.js"
import {apiresponse} from "../utils/apiresponse.js"
import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"


const getLikedVideos=asyncHandler(async(req,res)=>{
    const like=await Like.aggregate([
        {
            $match:{
              likedBy: new mongoose.Types.ObjectId(req.user?._id),
              video:{$exists:true,$ne:null},
              comment:{$exists:false},
              tweet:{$exists:false}
            }
        }
    ])
    return res.status(200).json(
        new apiresponse(200,like,"liked videos fetched successfully")
    )
})


const toggleVideoLike=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!videoId){
        throw new apierror(400,"video id is required")
    }
    const vido= await Video.findById(videoId)
    if(!vido){
        throw new apierror(404,"video not found")
    }
    const like=await Like.findOne({
        likedBy:req.user?._id,
        video:vido?._id
    })
    let isliked
    if(like){
        await Like.findByIdAndDelete(like._id)
        isliked=false

    }
    else{
        isliked=true
        await Like.create({
            likedBy:req.user?._id,
            video:vido._id
        })
    }
    return res.status(200).json(
        new apiresponse(200,{isliked},"likedvideo toggle successfully")
    )
    
}) 

const toggleCommentLike=asyncHandler(async(req,res)=>{
    const{commentId}=req.params
    if(!commentId){
        throw new apierror(400,"commentId required")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new apierror(400,"comment not found")
    }
    const commentLike=await Like.findOne({
        likedBy:req.user?._id,
        comment:commentId
    })
    let isLiked
    if(commentLike){
        isLiked=false
        await Like.findByIdAndDelete(commentLike._id)
    }
    else{
        isLiked=true
        await Like.create({
            likedBy:req.user._id,
            comment:commentId
        })
    }
     return res.status(200).json(
        new apiresponse(200,{isLiked},"likedcomment toggle successfully")
    )
   

})

const toggleTweetLike=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    if(!tweetId){
        throw new apierror(400,"tweet uid required")
    }
    const tweet= await Tweet.findById(tweetId)
    if(!tweet){
        throw new apierror(400,"tweet not found")
    }
    const tweetLike=await Like.findOne({
        likedBy:req.user?._id,
        tweet:tweetId
    })
    let isLiked
    if(tweetLike){
        isLiked=false
        await Like.findByIdAndDelete(tweetLike._id)
    }
    else{
        isLiked=true
        await Like.create({
            likedBy:req.user._id,
            tweet:tweetId
        })
    }
    return res.status(200).json(
        new apiresponse(200,{isLiked},"tweet toggle successfully")
    )
})


export{
    getLikedVideos,
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike
}


