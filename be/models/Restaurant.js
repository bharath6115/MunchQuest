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
    },
    reserveSeat:{
        type: String,
    },
    isVerified:{
        type: Boolean,
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