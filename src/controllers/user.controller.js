import {asyncHandler} from "../utils/asynchandler.js"
import {apierror} from "../utils/apierror.js"
import {User} from "../models/user.model.js"
import  {uploadOnCloudinary} from "../utils/cloudnary.js"
import {apiresponse} from "../utils/apiresponse.js"
import jwt from "jsonwebtoken"
import {deletefromcloudinary} from "../utils/dltefilefromcloud.js"


const generateAccessAndRefreshToken=async(userId)=>{
  try {
   const user = await User.findById(userId)
   const accessToken=user.generateAccessToken()
   const refreshToken=user.generateRefreshToken()

   user.refreshToken=refreshToken
   await user.save({validateBeforeSave:false})

   return {accessToken,refreshToken}
    
  } catch (error) {
    throw new apierror(500,"something went wrong while generating refreshtoken and accesstoken")
  }
}   

const registerUser = asyncHandler(async (req, res, next) => {

  //console.log("REQ.FILES
  //  =>", req.files);

   //1  get user details from frontened
    //2 validation-not empty
   //3  check if user already exists :username,email
   //4  check for images,avatar 
    //5 upload on cloudinary,avatar
    //6 create user object/response -create entry in db
    //7 remove pass aur refresh token from response
    // 8 check for user creation 
    //9 return res
      //1->
      const {fullname,email,username,password} =req.body// req.body se jo data form ya json se aata hai ,url se jo data aata usko baad me handle karenge
     // console.log("EMAIL IS :",email)

      //2->
      //if(fullname==="") throw new apierror(400,"mesg not found")
      if([fullname,email,username,password].some((field)=>
        field?.trim()==="")
      ){
        throw new apierror(400,"all fields are required")
      }


      //3->
      const existedUser =await User.findOne({
        $or:[{username},{email}]
      })

      if(existedUser){
        throw new apierror(409,"user with email or username or password already existed")
      }

      //4->
       const avatarLocalPath=req.files?.avatar[0]?.path
       //const coverImagePath=req.files?.coverImage[0]?.path

       let coverImagePath;
       if(req.files && Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length>0){
        coverImagePath=req.files.coverImage[0].path
      }
       if(!avatarLocalPath){
        throw new apierror(400,"avatar file is  required")
       }
       let coverImage=await uploadOnCloudinary(coverImagePath)
 
      // console.log("AVATAR LOCAL PATH:", avatarLocalPath);
       
       let avatar=await uploadOnCloudinary(avatarLocalPath)

       //console.log("CLOUDINARY AVATAR RESPONSE:", avatar);

      if(!avatar){
        throw new apierror(400,"avatar file is required")
       }

       //5->

       const user=await User.create({
        fullname,
        email,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        username:username.toLowerCase(),
        password
       })

       //6->
       const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
       )

       if(!createdUser){
       throw new apierror(500,"somryhing went wrong while registering the user")
       }


       //7->
       //return res.status(201).json({createdUser})
       return res.status(200).json(
        new apiresponse(200,createdUser,"User registered Successfully")
       ) 

        


 
})
    

const loginUser =asyncHandler(async(req,res,next)=>{    //req.body ->data
  //username or email
  //find user
  //password
  //access token todos and refreh token
  //send cookies
      const {username,email,password}=req.body
      console.log("EMAIL IS:",email)
      if(!email && !username ){
        throw new apierror(400,"either email or username  is compulsory")
      }
      
      const user=await User.findOne({
      $or:[{email},{username}]
      })

      if(!user){
        throw new apierror(404,"User does not exist")
      }
      const isPasswordValid=await user.ispasswordcorrect(password)
      if(!isPasswordValid){
        throw new apierror("401","invalid user crednetial")
      }

      const{accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)


         //cookies me bhejo ab

      const loggedInUser=await User.findById(user._id). // call kiya kyuki pichla user ke refresh token ka access nhi tha 
      select("-password -refreshToken")

      const options={
        httpOnly:true,
        secure:false
      };

      return res.status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
        new apiresponse(
          200,{
            user:loggedInUser,accessToken,refreshToken
          },
          "user login  successfully"
        )
      )

   
       


})
 
const logoutUser=asyncHandler(async(req,res,next)=>{ 
  //clear cookies  
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )
   const options={
    httpOnly:true,
    secure:false
   }

   return res.status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new apiresponse(200,{},"User logged out"))



   

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
  if(!incomingRefreshToken){
    throw new apierror(401,"unauthorized request")
  }
  try { 
    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user=await User.findById(decodedToken._id)
  
    if(!user){
      throw new apierror(401,"Invalid refreshtoken")
    }
    if(incomingRefreshToken!==user.refreshToken){
      throw new apierror(401,"refresh token is expired or used")
    }
  
    const {accessToken,newrefreshToken}=await generateAccessAndRefreshToken(user._id)
    //cookies me bhejna hai toh const options obejct bana lo
    const options={
      httpOnly:true,
      secure:true
    }
  
    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newrefreshToken,options)
    .json(
      new apiresponse(200,
        {accessToken,refreshToken:newrefreshToken },
        "Access token refresh successfully"
      )
    )
  } catch (error) {
    throw new apierror(401,error?.message || "Invalid refreh token")
  }
  
})


const changeCurrentPassword=asyncHandler(async(req,res)=>{
  const {oldpassword,newpassword}=req.body//if u want confirmpassword

  /*if confirm password hai toh just check 
  if(newpassword!==confirmpassword){
  throw new apierror ()
  }
   */
  const user=await User.findById(req.user?._id)
  const ispasswordcorrect=await user.ispasswordcorrect(oldpassword)

  if(!ispasswordcorrect){
    throw new apierror(400,"Invalid old password")
  }

  user.password=newpassword
  await user.save({validateBeforeSave:false})

  return res.status(200)
  .json(new apiresponse(200,{},"password changed successfully"))


})

const getCurrentUser=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.user?._id)
  return res.status(200)
  .json(new apiresponse(200,req.user,"current user fetched successfuly"))
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
  const {fullname,email}=req.body

  if(!fullname || !email){
    throw new apierror(401,"All fields are required");
  }

  const user =await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        email,
        fullname:fullname
    }
  },
    {new:true}
  )

  return res.status(200)
  .json(new apiresponse(200,user,"Account updated successfully"))





})

//file update karane ke liye new controller banao  alag end point banao better approach 
//keep in mind router me 
//multer se check  


//make utility todo-assignment delete old image of avatra nd coverimage 
//req.user used kar len adono me 

const updateUserAvatar=asyncHandler(async(req,res)=>{
  
  const userold=await User.findById(req.user?._id)
  if(!userold){
    throw new apierror(404,"user not found")
  }
  const oldavatar= userold.avatar?.url


  const avatarLocalPath=req.file?.path

  if(!avatarLocalPath){
    throw new apierror(400,"avatar file is missing")
  }

 const avatar= await uploadOnCloudinary(avatarLocalPath)


 if(!avatar){
  throw new apierror(401,"error while uploading file on cloudinary")
 }

 const user=await User.findByIdAndUpdate(req.user._id,{
  $set:{
    avatar:avatar.url
  }
 },{new:true})
 .select("-password")


 if(oldavatar){
  await deletefromcloudinary(oldavatar)
 }


 return res.status(200)
 .json(new apiresponse(200,user,"avatar image updated successfully"))

})


const updateUserCoverImage=asyncHandler(async(req,res)=>{

  const userold=await user.findById(req.user?._id)
  if(!userold){
    throw new apierror(404,"user not found")
  }
  const oldcoverimage=userold.avatar?.url

  const coverImageLocalPath=req.file?.path

  if(!coverImageLocalPath){
    throw new apierror(400,"avatar file is missing")
  }

 const coverImage =await uploadOnCloudinary(coverImageLocalPath)


 if(!coverImage){
  throw new apierror(401,"error while uploading file on cloudinary")
 }

 const user=await User.findByIdAndUpdate(req.user._id,{
  $set:{
    coverImage:coverImage.url
  }
 },{new:true})
 .select("-password")

 if(oldcoverimage){
  await deletefromcloudinary(oldcoverimage)
 }
 return res.status(200)
 .json(new apiresponse(200,user,"cover image updated successfully"))

})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username}= req.params
    if(!username?.trim()){
      throw new apierror(400,"username is missing ")
    }

    const channel=await User.aggregate([
      {
        $match:{
          username:username?.tolowerCase()
        }
      },
      {
        $lookup:{
          from:"subscriptions",
          localField:"_id",
          foreignField:"channel",
          as:"subscribers"
        }
      },
      {
        $lookup:{
          from:"subscriptions",
          localField:"_id",
          foreignField:"subscriber",
          as:"subscribedTo"
        }
      },
      {
        $addFields:{
          subscribersCount:{
            $size:"$subscribers"
          },
          channelSubscribedToCount:{
            $size:"$subscribedTo"
          },
          isSubscribed:{
            $cond:{
              if:{$in:[req.user?._id,"$subscribers.subscriber"]},
              then:true,
              else:false
            }
          }
        }
      },
      {
        $project:{
        fullname:1, 
        username:1,
        subscribersCount:1,
        channelSubscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        email:1
        }
      }


    ])
    //channel ka output hoga wo [{},{},{}] jo bhi return kar reh hai wo ke object me hoga 

    if(!channel?.length){
      throw new apierror(400,"channel does not exist ")
    }
    return res
    .status(200)
    .json(
      new apiresponse(200,channel[0],"User channel fetch successfully")
    )
    
})


const getWatchHistory=asyncHandler(async(req,res)=>{
  const user=await User.aggregate([
    {
      $match:{
        _id:new mongoose.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup:{
        from:"videos", 
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
           {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullname:1,
                    username:1,
                    avatar:1
                  }
                }
              ]
            }
           },// owner ka fileds array me aarha tha usko object me karne ke liye extra pipeline laagaye
           {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
           }
        ]
      }
    }
  ])

  return res.status(200)
  .json(new apiresponse(200,user[0].watchHistory
    ,"watch history has benn fetched successfully"))
})


/*watchhistory ka pipelien hai 

console.log(user)
[
  {
    _id: ObjectId("U1"),
    username: "rehan",
    email: "rehan@gmail.com",
    password: "hashed...",
    watchHistory: [
      {
        _id: ObjectId("V1"),
        title: "MongoDB Tutorial",
        description: "...",
        owner: [
          {
            _id: ObjectId("U9"),
            fullname: "Chai Aur Code",
            username: "chaiaurcode",
            avatar: "chai.png",
            email: "chai@code.com",
            password: "hashed..."
          }
        ]
      }
    ],
    createdAt: "...",
    updatedAt: "..."
  }
]



aswatchhistory hai 
watchHistory: [
  {
    _id: ObjectId("V1"),
    title: "MongoDB Tutorial",
    thumbnail: "v1.png",
    owner: {
      _id: ObjectId("U9"),
      username: "chaiAurCode",
      avatar: "owner.png"
    }
  }
]

 */



  export {registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
  
  } 


  /*
user collection ka doc
 {
  _id: ObjectId("AAA"),
  username: "chaiAurCode"
}




subscription collection ka doc 
{
  _id: ObjectId("S1"),
  subscriber: ObjectId("BBB"),
  channel: ObjectId("AAA")
}
{
  _id: ObjectId("S2"),
  subscriber: ObjectId("CCC"),
  channel: ObjectId("AAA")
}
{
  _id: ObjectId("S3"),
  subscriber: ObjectId("DDD"),
  channel: ObjectId("AAA")
}



  subscriber ka doc
  subscribers: [
  {
    _id: ObjectId("S1"),
    subscriber: ObjectId("BBB"),
    channel: ObjectId("AAA")
  },
  {
    _id: ObjectId("S2"),
    subscriber: ObjectId("CCC"),
    channel: ObjectId("AAA")
  },
  {
    _id: ObjectId("S3"),
    subscriber: ObjectId("DDD"),
    channel: ObjectId("AAA")
  }
]



 */

