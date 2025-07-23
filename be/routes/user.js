import express from "express"
import mongoose from "mongoose";
import User from "../models/Users.js";
import validateUser from "../models/UserValidation.js"
import validateNotification from "../models/NotificationValidation.js"

const router = express.Router();

router.get("/", async (req, res) => {
    const data = await User.find();
    res.send(data);
})

router.get("/:uid", async (req, res) => {

    const data = await User.findOne({uid: req.params.uid});
    if (!data) return res.status(404).send("Invalid user ID");
    
    res.send(data);
})
//Add user
router.post("/", async (req, res) => {
    const { value, error } = validateUser.validate(req.body);
    if (error) return res.status(404).send(error.details)

    const newUser = new User(value);
    await newUser.save();
    
    res.send(newUser);
})

//Delete user
router.delete("/:uid", async (req, res) => {

    const data = await User.findOneAndDelete({uid:req.params.uid});
    if (!data) return res.status(404).send("Invalid user ID");
    
    res.send("deleted");
})

//Correct user data
router.patch("/:uid", async (req, res) => {
    
    const { value, error } = validateUser.validate(req.body);
    if (error) return res.status(404).send(error.details)
        
    const data = await User.findOneAndUpdate({uid:req.params.uid},value,{new:true, runValidators:true});
    if (!data) return res.status(404).send("Invalid user ID");
    await data.save();

    res.send(data);
})

export default router;