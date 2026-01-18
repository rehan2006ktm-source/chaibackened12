import {asyncHandler} from "../utils/asynchandler.js"
import {apierror} from "../utils/apierror.js"
import {User} from "../models/user.model.js"
import  {uploadOnCloudinary} from "../utils/cloudnary.js"
import {apiresponse} from "../utils/apiresponse.js"

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

    


export {registerUser} 