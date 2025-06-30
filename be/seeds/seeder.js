import {fName,sName,location} from "./helper.js"
import { sampleReviews } from "./helper.js";
import Restaurant from "../models/Restaurant.js"
import Review from "../models/Review.js";
import mongoose from "mongoose"

mongoose.connect("mongodb://localhost:27017/MunchQuest")
.then(()=>console.log("Seeder connected"))
.catch(e=>{console.log(e)});

const rand = (x) => {
    return x[Math.floor(Math.random()*x.length)];
}

const seedDB = async()=>{

    await Restaurant.deleteMany({});
    await Review.deleteMany({});

    
    for(let i=0;i<30;i++){
        const reviews = [];
        let rating=0;
        for(let i=0;i<4;i++){
            const data= new Review({
                message: rand(sampleReviews),
                rating: Math.floor(Math.random()*5)+1,
                owner: "3YAqeFigfYXG1lwN8IgUMlWxyN83",
            })
            rating += data.rating;
            await data.save();
            reviews.push(data._id); //push the ids, not whole data.
        }
        const data = new Restaurant({
            title : `${rand(fName)} ${rand(sName)}`,
            location : rand(location),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit nemo praesentium nobis, quam impedit, quidem explicabo nostrum, adipisci laboriosam sed qui consequuntur debitis voluptate rerum natus assumenda deleniti deserunt magni?",
            reviews: reviews,
            rating: rating/reviews.length,
            owner:"3YAqeFigfYXG1lwN8IgUMlWxyN83",
        })
        await data.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})
