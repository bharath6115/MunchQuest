import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
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