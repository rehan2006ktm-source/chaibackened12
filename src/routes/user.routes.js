import {Router} from "express"
 
import  {
  registerUser, loginUser,logoutUser
  ,refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
  } from "../controllers/user.controller.js"


import {upload} from"../middlewares/multer.middlewares.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router=Router()
 

router.route("/register").post(
    upload.fields([ 
       {
        name:"avatar",
        maxCount:1 
       },{
        name:"coverImage",
        maxCount:1
       } 
    ]),
    registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refreshToken").post(refreshAccessToken)
//verifyjwt user asli hai ya nakli// ya user logged in hai ya nhi 

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/avatar").patch(verifyJWT,upload.single("avatar")
,updateUserAvatar)

router.route("/coverImage").patch(verifyJWT,upload.single("coverImage")
,updateUserCoverImage)        

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)//req.params se data

router.route("/history").get(verifyJWT,getWatchHistory)


/*
fetch("http://localhost:8000/api/v1/users/history", {
   method: "GET",
   headers: {
      Authorization: `Bearer ${token}`
   }
}); */
export default router
//app.use(/api/v1/healthcheck", healthcheckRouter)
/*req.files = {
  avatar: [
    {
      fieldname: "avatar",
      originalname: "a.jpg",
      mimetype: "image/jpeg",
      size: 12345,
      ...
    },
    {
      fieldname: "avatar",
      originalname: "b.jpg",
      mimetype: "image/jpeg",
      size: 67890,
      ...
    }
  ]
     coverImage: [
    { originalname: 'cover.jpg', ... }
  ]

}
 *///req.body
/*{
  username: 'rehan_khan',
  email: 'rehan@gmail.com',
  password: '123456',
  fullname: 'Rehan Khan',
  age: '21',
  role: 'user',
  isVerified: 'false',
  skills: [ 'cpp', 'javascript', 'react' ],
  address: {
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001'
  }
}
 */