import {Router} from "express"
import  {registerUser, loginUser,logoutUser,refreshAccessToken} from "../controllers/user.controller.js"
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
//verifyjwt user asli hai ya nakli
export default router

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