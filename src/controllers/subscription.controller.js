import mongoose from "mongoose"
import {User} from "../models/user.model.js"
import {Subscription} from "../models/subscription.model.js"
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const toggleSubscription=asyncHandler(async(req,res)=>{
    const {channelId}=req.params
    if(!channelId){
        throw new apierror(400,"channelId required")
    }
    if(!mongoose.isValidObjectId(channelId)){
        throw new apierror(400,"invalid channelid")
    }
  
    const subscriber=req.user?._id

    if(subscriber.toString()===channelId.toString()){
        throw new apierror(400,"you cannot subscribe to yourself ")
    }
    const subscription=await Subscription.findOne({
        subscriber:req.user._id,
        channel:channelId
    })
    let isSubscribed
    if(subscription){
        isSubscribed=false
        await Subscription.findByIdAndDelete(subscription._id)
    }
    else{
        isSubscribed=true
        await Subscription.create({
            channel:channelId,
            subscriber:req.user?._id
        })
    }
    return res.status(200).json(
        new apiresponse(200,isSubscribed,"toggleSubscription done successfully")
    )


})

const getUserChannelSubscribers=asyncHandler(async(req,res)=>{
    //todo-subscriber list of channel
    const {channelId} =req.params
    if(!channelId){
        throw new apierror(400,"channelId is required")
    }
    if(!mongoose.isValidObjectId(channelId)){
        throw new apierror(400,"invalid channelId")
    }
    const subscription=await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber"
            }

        },
         {
            $unwind:"$subscriber"
        },
        {
            $project:{
                "subscriber.username":1,
                "subscriber.fullname":1,
                "subscriber.email":1,
            }
        }
    ])

    const totalsubscriber=await Subscription.countDocuments({
        channel:channelId
    })
            
    

    
    return res.status(200).json(
        new apiresponse(200,{subscription,totalsubscriber},"user channel subscriber fetched successfully")
    )
   
})

const getSubscribedChannels=asyncHandler(async(req,res)=>{
    //jisko maine subscribed kya hai  channel diff subscriber const 
    const userId = req.user._id;
    if(!userId){
        throw new apierror(400,"user ifd not found")
    }
  const subscribedChannels = await Subscription.aggregate([
    {
      // maine jin channels ko subscribe kiya
      $match: {
        subscriber: userId
      }
    },
    {
      // channel ki details lana
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails"
      }
    },
    {
      $unwind: "$channelDetails"
    },
    {
      $project: {
        _id: 0,
         "channelDetails._id":1,
        "channelDetails.username":1,
        "channelDetails.fullName":1,
        "channelDetails.avatar":1
      }
    }
  ]);

  return res.status(200).json({
    success: true,
    count: subscribedChannels.length,
    data: subscribedChannels
  });
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
