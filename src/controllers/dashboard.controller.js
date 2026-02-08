import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import  {User} from "../models/user.model.js"

const getChannelStats=asyncHandler(async(req,res)=>{


    const totalVideos=await Video.countDocuments({
        owner:req.user?._id
    })

   const totalViews=await Video.aggregate([
    {
        $match:{
            owner:new mongoose.Types.ObjectId(req.user._id)
        },
    },
         {//views video model ke andar ka part hai alrady track ho jaa rh ahai views so 
            $group:{
             _id:null,
             totalviews:{$sum:"$views"}
         }
     }
   ])

   const totalviews =
  totalViews.length > 0 ? totalViews[0].totalviews : 0

   const totalLikes=await Video.aggregate([
    {
        $match:{
            owner:new mongoose.Types.ObjectId(req.user?._id)
        }
    },
    {
        $lookup:{
            from:"likes",
            localField:"_id",
            foreignField:"video",
            as:"like"
        }
    },
    {
        $addFields:{
            countLike:{
                $size:"$like"
            }
        }
    },
      {
            $group: {
                _id: null,
                totallikes: { $sum: "$countLike" }
            }
    },
  ])

    const totallikes =
  totalLikes.length > 0 ? totalLikes[0].totallikes: 0



   const totalSubscriber=await Subscription.countDocuments({
    channel:req.user?._id
   })
   const totalSubscribedTo=await Subscription.countDocuments({
    subscriber:req.user._id
   })

   return res.status(200).json(
    new apiresponse(200,
        {totalVideos,totallikes,totalviews,totalSubscriber,totalSubscribedTo},
        "channel stats fetched successfully"
    )
   )

})

const getChannelVideos=asyncHandler(async(req,res)=>{
    const video=await Video.aggregate([
    {
        $match:{
            owner:new mongoose.Types.ObjectId(req.user?._id)
        }
    }
    ])
    return res.status(200).json(
        new apiresponse(200,video,"channel videos fetched successfully")
    )
})


export{
    getChannelStats,
    getChannelVideos
}