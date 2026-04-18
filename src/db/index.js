import mongoose from "mongoose";
import {DB_NAME} from "../constant.js";

const connectDB =async () => {
    try {
        const baseUri = (process.env.MONGODB_URI || "").replace(/\/+$/, "");
        const connectioninstance =await mongoose.connect(`${baseUri}/${DB_NAME}`)
        console.log(`\n Mongodb connected !! DB HOST :
            ${connectioninstance.connection.host}`)
    }
    catch(error){
        console.log("MONGODB connection error:",error);
        process.exit(1)
}
}

export default connectDB ;
