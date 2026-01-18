import mongoose,{Schema} from"mongoose"

import jwt from "jsonwebtoken"
import bcrypt from  "bcrypt"

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudneray service url
        required:true,
    },
    coverImage:{
        type:String,
        //required:true
    },
    watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"video"
    }],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String
    }







},{timestamps:true})

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return 
    this.password=await bcrypt.hash(this.password,10)
    
} )

userSchema.methods.ispasswordcorrect=async function(password){
   return await bcrypt.compare(this.password,password)

}

userSchema.methods.generateAccessToken=function (){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresin:process.env.ACCESS_TOKEN_EXPIRY}
    )
}
userSchema.methods.generateRefreshToken=function (){
     return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresin:process.env.REFRESH_TOKEN_EXPIRY}
    )

}


export const User=mongoose.model("User",userSchema); 