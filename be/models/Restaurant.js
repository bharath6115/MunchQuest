import mongoose from "mongoose"

const RestaurantSchema = new mongoose.Schema({
    owner:{
        type:String,
        required:true
    },
    title: {
        type:String,
        required: true,
    },
    description:{
        type : String,
        required: true,
    },
    location :{
        type: String,
        required: true,
    },
    rating : {
        type: Number,
        default: 0,
    },
    reserveSeat:{
        type: String,
        default: "Reserve a seat"
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    images:[
        {
            type: String,
        }
    ],
    menu:[
        {
            type: String,
        }
    ],

})

const Restaurant = mongoose.model("Restaurant",RestaurantSchema);

export default Restaurant;