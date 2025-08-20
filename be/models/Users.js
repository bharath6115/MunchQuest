import mongoose from "mongoose";
import Restaurant from "./Restaurant.js"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        default: "user",
    },
    uid:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required: true,
    },
    notifications:[
        {
            from:{
                type: String,
                required:true,
            },
            message:{
                type:String,
                required:true,
                default:"Request to reserve seat"
            },
            notificationDate:{
                type:Date,
                default: Date.now,
            },
            isRead:{
                type:Boolean,
                default: false,
            },
        }
    ],
    // reservations: [
    //     {
    //         at:{
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: Restaurant,
    //             required:true,
    //         },
    //         reservationDate:{
    //             type:String,
    //             required:true,
    //         },
    //     }
    // ]
})

const User = mongoose.model("User",userSchema);

export default User;