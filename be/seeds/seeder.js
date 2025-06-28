import {fName,sName,location} from "./helper.js"
import Restaurant from "../models/Restaurant.js"
import mongoose from "mongoose"

mongoose.connect("mongodb://localhost:27017/MunchQuest")
.then(()=>console.log("Seeder connected"))
.catch(e=>{console.log(e)});

const rand = (x) => {
    return Math.floor(Math.random()*x.length);
}

const seedDB = async()=>{

    await Restaurant.deleteMany({});

    for(let i=0;i<30;i++){
        const data = new Restaurant({
            title : `${fName[rand(fName)]} ${sName[rand(sName)]}`,
            location : location[rand(location)],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit nemo praesentium nobis, quam impedit, quidem explicabo nostrum, adipisci laboriosam sed qui consequuntur debitis voluptate rerum natus assumenda deleniti deserunt magni?"
        })
        await data.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})
