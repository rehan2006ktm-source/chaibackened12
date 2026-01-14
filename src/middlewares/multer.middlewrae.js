 import multer from "multer"


 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
  }
})
export const upload = multer({ storage })



//Multer ek library hai
//👉 Jo file upload handle karne ke liye middleware banati hai

