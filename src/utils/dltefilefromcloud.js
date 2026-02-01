import cloudinary from "cloudinary"


const deletefromcloudinary=async(fileurl)=>{
    try {
        if(!fileurl) return null
         await cloudinary.uploader.destroy(fileurl)
    
    } catch (error) {
        console.log("error while deleting the file from cloudinary",error.message)
        throw error
    }}

    export {deletefromcloudinary}