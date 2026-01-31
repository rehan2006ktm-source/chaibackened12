import {v2 as cloudinary} from "cloudinary"
import fs from "fs"



    // Configuration
cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary=async(localfilepath)=>{
    try{
        if(!localfilepath) return null;
       const response= await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        })
       // console.log ("FILE HAS BEEN UPLOADED SUCCESSFULLY",response.url)
        fs.unlinkSync(localfilepath)
       
        return response// session id ,id, url,secure url,version
    }
    catch(error){
        console.error("CLOUDINARY ERROR 👉", error.message);
  
        if(localfilepath){
            fs.unlinkSync(localfilepath)
        }
        return null

    }
}

export {uploadOnCloudinary}

/*
{ response.url hai 
  asset_id: "c123...",
  public_id: "user_avatars/abc123",
  version: 1706512345,
  width: 512,
  height: 512,
  format: "png",
  resource_type: "image",
  created_at: "2026-01-30T10:20:30Z",
  url: "http://res.cloudinary.com/...",
  secure_url: "https://res.cloudinary.com/...",
}
*/ 