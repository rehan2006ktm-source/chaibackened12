import {asynchandler} from "../utils/apiresponse"

const registerUser=asynchandler(async(req,res)=>{
   return res.status(200).json({
        message:"ok"
    })
})

export {registerUser}