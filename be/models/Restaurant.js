import mongoose from "mongoose"

const RestaurantSchema = new mongoose.Schema({
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
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ]

})

const Restaurant = mongoose.model("Restaurant",RestaurantSchema);

export default Restaurant;