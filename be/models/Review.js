import mongoose from "mongoose"
import Restaurant from "./Restaurant.js";

const reviewSchema = new mongoose.Schema({
    
    rating : {
        type: Number,
        required:true,
    },
    message:{
        type: String,
        required:true,
    },
    owner :{
        type: String,   //firebase ID
        required: true,
    },

},{timestamps:true})

const Review = mongoose.model("Review",reviewSchema);

export default Review;