 import multer from "multer"
 import fs from "fs"
 import path from "path"


 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.resolve("public", "temp")
    fs.mkdirSync(uploadDir, { recursive: true })
    cb(null, uploadDir) //path.resolve("/public/temp")
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, "-")
    cb(null, `${Date.now()}-${safeName}`)
  }
})
export const upload = multer({ storage })
//req.file me file hote hai like [avatar{upload},coverimage{upoad}]
// ye upload me hota hai height,width,id,fieldname,originalname,path,size,destination req.file me ye sb rehta hai

//Multer ek library hai
//👉 Jo file upload handle karne ke liye middleware banati hai
/*{req.files
  fieldname: 'avatar',
  originalname: 'photo.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'public/temp',
  filename: 'photo.png',
  path: 'public/temp/photo.png',
  size: 34567
}
 */



/* req.files
{
  avatar: [
    {
      fieldname: 'avatar',
      originalname: 'profile.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: 'public/temp',
      filename: '171234567-profile.png',
      path: 'public/temp/171234567-profile.png',
      size: 34567
    }
  ],

  coverImage: [
    {
      fieldname: 'coverImage',
      originalname: 'cover.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: 'public/temp',
      filename: '171234568-cover.png',
      path: 'public/temp/171234568-cover.png',
      size: 45678
    }
  ]
} */