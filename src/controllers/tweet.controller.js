import mongoose from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const createTweet=asyncHandler(async(req,res)=>{
    const {content}=req.body
    if(!content || !content.trim() ){
        throw new apierror(400,"tweet field is required")
    }
    const tweet =await Tweet.create({
        owner:req.user._id,
        content:content
    })
    if(!tweet){
        throw new apierror(400,"failed to create tweet")
    }
    return res.status(200).json(
        new apiresponse(200,tweet,"tweet created successfully")
    )


})

const getUserTweets=asyncHandler(async(req,res)=>{
    const {userId}=req.params
    if(!userId){
        throw new apierror(400,"userId required")
    }
    if (!mongoose.isValidObjectId(userId)) {
    throw new apierror(400, "Invalid userId")
   }

    const tweet=await Tweet.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },{
            $sort:{
                createdAt:-1
            }
        }
          
    ])
    return res.status(200).json(
            new apiresponse(200,tweet,"user tweet fetched successfully"))
 })

 const updateTweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    if(!tweetId){
        throw new apierror(400,"tweet id required")
    }
    const tweet =await Tweet.findById(tweetId)
    if(!tweet){
        throw new apierror(404,"tweet not found")
    }
    if(req.user?._id.toString()!==tweet.owner.toString()){
        throw new apierror(403,"you are not authorized to update")
    }
    const {content}=req.body
    tweet.content=content
    await tweet.save({validateBeforeSave:false})

    return res.status(200).json(
        new apiresponse(200,tweet,"tweet updated successfully")
    )
 })

 const deleteTweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    if(!tweetId){
        throw new apierror(400,"tweet id is required")
    }
    const tweet =await Tweet.findById(tweetId)
    if(!tweet){
        throw new apierror(404,"tweet not found")
    }
    if(req.user?._id.toString()!==tweet.owner.toString()){
        throw new apierror(403,"you are not authorized to delete")
    }
    await Tweet.findByIdAndDelete(tweet._id)
    return res .status(200).json(
        new apiresponse(200,{"message":"deleted"},"tweet deleted successfully")
    )
    
 })

export{
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}