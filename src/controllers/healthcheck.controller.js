import {asyncHandler} from "../utils/asynchandler.js"
import {apierror} from "../utils/apierror.js"
import { apiresponse } from "../utils/apiresponse.js"

const healthCheck=asyncHandler(async(req,res)=>{
    return res.status(200).json(
        new apiresponse(200,{"status":"ok"},"server is running")
    )
})


export{
    healthCheck
}