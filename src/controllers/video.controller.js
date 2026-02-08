import {asyncHandler} from "../utils/asynchandler.js"
import {apierror} from "../utils/apierror.js"
import {User} from "../models/user.model.js"
import  {uploadOnCloudinary} from "../utils/cloudnary.js"
import {apiresponse} from "../utils/apiresponse.js"
import jwt from "jsonwebtoken"
import {deletefromcloudinary} from "../utils/dltefilefromcloud.js"
import mongoose from "mongoose"
import {Video} from "../models/video.model.js"



 const getAllVideos=asyncHandler(async(req,res)=>{
    const {page=1,limit=10}=req.query
    const video=await Video.aggregate([
        {
            $match:{
                isPublished:true,
                isDeleted:false
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner"
            }
        },
        {
            $unwind:"$owner"
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $skip:(Number(page)-1)*Number(limit)
        },
        {
            $limit:Number(limit)
        },
        {
            $project:{
                title:1,
                description:1,
                videoFile:1,
                thumbnail:1,
                views:1,
                duration:1,
                createdAt:1,
                "owner._id":1,
                "owner.fullname":1,
                "owner.avatar":1


            }
        }

    ])
    return res.status(200).json(
       new apiresponse (200,video,"all videos has benn fetched successfully")
    )
})

const publishVideo=asyncHandler(async(req,res)=>{
    const{title,description,}=req.body
    if([title,description].some((fields)=>
        fields?.trim()===""
    )){
        throw new apierror(400,"title and description are requires")
    }
    const videoFileLocalPath=req.files?.videoFile[0]?.path
    if(!videoFileLocalPath){
        throw new apierror(400,"videofile is required")
    }
    const thumbnailLocalPath=req.files?.thumbnail[0]?.path
    if(!thumbnailLocalPath){
        throw new apierror(400,"thumbnail is required")
    }
    const videoFile=await uploadOnCloudinary(videoFileLocalPath)
    if(!videoFile){
        throw new apierror(400,"avatar file is required")
    }
    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail){
        throw new apierror(400,"thummbnail is required")
    }
    
    const video=await Video.create({
        title,
        description,
        owner:req.user?._id,//ispublised views duration kaise check akre
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        views:0,
        duration:videoFile?.duration ||0,
        isPublished:true,
        isDeleted:false
    })
    return res.status(200).json(
        new apiresponse(200,video,"video file uploaded successfully")
    )
    
})

const getVideoById=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!videoId){
        throw new apierror(400,"video url required")
    }
    const video=await Video.findByIdAndUpdate(videoId,
        {
            $inc:{views:1}
        }
        ,{new:true}
    )
    if(!video){
        throw new apierror(404,"video is not found")
    }
    return res.status(200).json(
        new apiresponse(200,video,"video fetched successfully")
    )

})

const deleteVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!videoId){
        throw new apierror(400,"video id required")
    }
   const video=await Video.findById(videoId)
   if(!video){
    throw new apierror(404,"video not found")
   }
   if(req.user._id.toString()!==video.owner.toString()){
    throw new apierror(400,"you are not authorized to delted video")
   }
   await Video.findByIdAndDelete(videoId)
   return res.status(200).json(
    new apiresponse(200,{},"video delted successfully")
   )
   
   await Video.findByIdAndUpdate(videoId, {
  isDeleted: true,
  isPublished: false
})

   
   
   

})

const updateVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!videoId){
        throw new apierror(400,"url required")
    }
    const video=await Video.findById(videoId)
    if(!video){
         throw new apierror(404,"video not found")
    }
    if(video.owner.toString()!==req.user._id.toString()){
      throw new apierror(400,"you are not authorized")
    }

    const{title,description,isPublished}=req.body
    if(title){
        video.title=title
    }
    if(description){
        video.description=description
    }
    if(typeof isPublished==="boolean"){
        video.isPublished=isPublished
    }
    if(req.files?.thumbnail[0]?.path){
        const newThumbnail=req.files?.thumbnail[0]?.path
        const newThumbnaillocalPath=await uploadOnCloudinary(newThumbnail)
        video.thumbnail=newThumbnaillocalPath.url
    }
    await video.save({validateBeforeSave:false})

     return res.status(200).json(
        new apiresponse(200,video,"videos updated successfully")
     )

})

const togglePublishStatus=asyncHandler(async(req,res)=>{
    const { videoId } = req.params

  if (!videoId) {
    throw new apierror(400, "video id is required")
  }

  const video = await Video.findById(videoId)

  if (!video) {
    throw new apierror(404, "video not found")
  }

  // 🔒 Authorization
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new apierror(403, "you are not authorized to update this video")
  }

  // ❌ Deleted video can't be published
  if (video.isDeleted) {
    throw new apierror(400, "deleted video cannot be published")
  }

  // 🔄 TOGGLE
  video.isPublished = !video.isPublished

  await video.save({ validateBeforeSave: false })

  return res.status(200).json(
    new apiresponse(
      200,
      { isPublished: video.isPublished },
      `Video ${video.isPublished ? "published" : "unpublished"} successfully`
    )
  )
})

export{
    publishVideo,
    getVideoById,
    deleteVideo,
    getAllVideos,
    updateVideo,
    togglePublishStatus
}