import express from "express"
import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";
import Review from "../models/Review.js";
import RestaurantValidation from "../models/RestaurantValidation.js";
import Reservation from "../models/Reservation.js";

const router = express.Router({ mergeParams: true });

/*
1.Fetch all restaurants
2.Fetch single restaurant
3.Create new restaurant
4.Delete a restaurant
5.Modify a restaurant
*/

router.get("/", async (req, res) => {
    const data = await Restaurant.find();
    res.send(data);
})

router.get("/verified", async (req, res) => {
    const data = await Restaurant.find({ isVerified: true });
    res.send(data);
})
router.get("/notVerified", async (req, res) => {
    const data = await Restaurant.find({ isVerified: false });
    res.send(data);
})

router.get("/queries", async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query string required" });

    const data = await Restaurant.find({
        title: { $regex: query, $options: 'i' } // Case-insensitive partial match
    }).limit(10);
    res.send(data);
})

router.get("/batch/:ids", async (req,res)=>{
    const ids = req.params.ids.split(',');
    if(!ids || ids.length === 0) return res.send("Invalid ids")

    const data = await Restaurant.find({ _id: { $in: ids } });
    const map = {};
    data.forEach(r => map[r._id] = r);

    res.send(map);
})

router.get("/:id", async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send("Invalid ID");

    const data = await Restaurant.findById(req.params.id);
    if (!data) {
        res.status(404).send("Data with specified Id not found");
    }
    res.send(data);
})

router.post("/", async (req, res) => {

    const { value, error } = RestaurantValidation.validate(req.body);
    if (error) return res.status(404).send(error.details)

    const data = new Restaurant(value);
    await data.save();

    res.status(201).json(data);
})

router.delete("/:id", async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send("Invalid ID, cant Delete.");

    const data = await Restaurant.findById(req.params.id)
    const reservationData = await Reservation.find({restaurantID: req.params.id});
    if (!data) return res.status(404).send("Cant Delete.")


    //delete all reviews associated with the restaurant.
    await Promise.all(data.reviews.map(reviewId => Review.findByIdAndDelete(reviewId)));
    await Promise.all(reservationData.map(obj => Reservation.findByIdAndDelete(obj._id)));

    await Restaurant.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Deleted" });
})

router.patch("/:id", async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send("Invalid ID");

    const { value, error } = RestaurantValidation.validate(req.body);
    if (error) return res.status(404).send(error.details)

    const data = await Restaurant.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!data) return res.status(404).send("Invalid data")

    await data.save();
    res.status(200).json(data);
})

export default router