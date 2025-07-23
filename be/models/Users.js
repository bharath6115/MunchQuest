import mongoose from "mongoose";

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
    unreadNotificationsCount:{
        type:Number,
        default: 0,
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
            reservationDate:{
                type:String,
                required:true,
            },
            isRead:{
                type:Boolean,
                default: false,
            },
        }
    ]
})

const User = mongoose.model("User",userSchema);

export default User;