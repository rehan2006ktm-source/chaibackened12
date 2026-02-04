import mongoose from "mongoose"
//plugging ki traf inject 


import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const videoSchema=new mongoose.Schema({
    videofile:{ // cloudnery 
         type:String,
         required:true
    },
    thumbnail:{
        type:String, // cloudnery
        require:true
    },
     title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    duration:{ //cloudnery 
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    ispublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
//sirf id aayega 
    }



},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoSchema)