 import multer from "multer"


 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
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
