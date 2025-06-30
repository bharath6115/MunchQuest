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
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ]

})

const Restaurant = mongoose.model("Restaurant",RestaurantSchema);

export default Restaurant;