import {fName,sName,location,images} from "./helper.js"
import { reviewsWithRating } from "./helper.js";
import { menuItems } from "./helper.js";
import Restaurant from "../models/Restaurant.js"
import Review from "../models/Review.js";
import User from "../models/Users.js";
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();
let URL = "mongodb://localhost:27017/MunchQuest";
URL = process.env.DB_URL;

mongoose.connect(URL)
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
        const menu = [];
        let rating=0;

        for(let i=0;i<10;i++){
            const data = new Review({...(rand(reviewsWithRating)),["owner"]: process.env.ADMIN_UID});
            await data.save();
            rating += data.rating;
            reviews.push(data._id); //push the ids, not whole data.
        }

        for(let i=0;i<10;i++){
            menu.push(rand(menuItems));
        }

        const data = new Restaurant({
            title : `${rand(fName)} ${rand(sName)}`,
            location : rand(location),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit nemo praesentium nobis, quam impedit, quidem exLorem ipsum dolor sit amet consectetur adipisicing elit. Velit nemo praesentium nobis, quam impedit, quidem explicabo nostrum, adipisci laboriosam sed qui consequuntur debitis voluptate rerum natus assumenda deleniti deserunt magniplicabo nostrum, adipisci laboriosam sed qui consequuntur debitis voluptate rerum natus assumenda deleniti deserunt magni?",
            reviews: reviews,
            rating: (rating/reviews.length),
            reserveSeat:"Reserve a seat",
            owner:process.env.ADMIN_UID,
            isVerified: true,
            images: [images[i%(images.length)]],
            menu: menu,
        })
        await data.save();
    }
    await seedUsers();
}

const seedUsers = async ()=>{
    await User.deleteMany({});
    await User.insertMany([
        {"username":"Admin","uid":"3YAqeFigfYXG1lwN8IgUMlWxyN83","email":"admin@gmail.com"},
        {"username":"User","uid":"sxKvdQj41YQ28LzFipMFHd0upnN2","email":"user@gmail.com"},
        {"username":"Test","uid":"haVBgayWBhgKZeJRaNqaxvirwB42","email":"test@gmail.com"},
        {"username":"Thanusha","uid":"msbxJ7HbxWahPGIjFxbxq99hAWD3","email":"thanu@gmail.com"},
        {"username":"ramki","uid":"X5xhKu2XvNez2noJ9leOWijikSy2","email":"r@gmail.com"},
    ])
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})