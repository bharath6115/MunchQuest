import express from "express"
import mongoose from "mongoose"
import Review from "../models/Review.js"
import Restaurant from "../models/Restaurant.js"
import ReviewValidation from "../models/ReviewValidation.js"

const router = express.Router({ mergeParams: true });

/*
1.Fetch all reviews
2.Fetch single review
3.Create new review
4.Delete a review
5.Modify a review
*/

//Validate the Restaurant ID.
router.use((req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.Rid)) return res.status(404).send("Not a valid Restaurant ID!")
    next();
})

//Populate the reviews part and send the data
router.get("/", async (req, res) => {
    const data = await Restaurant.findById(req.params.Rid).populate("reviews");
    res.send(data.reviews);
})

//Find Review by ID
router.get("/:id", async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send("Not a valid review ID");

    const data = await Review.findById(req.params.id);
    if (!data) return res.status(404).send("Invalid Review ID")
    res.send(data);
})

router.post("/", async (req, res) => {

    const data = await Restaurant.findById(req.params.Rid);
    if (!data) return res.status(404).send("Invalid Restaurant ID") //actually not needed cuz of middlewear but let it be

    const { value, error } = ReviewValidation.validate(req.body);
    if (error) return res.status(404).send(error.details);

    const newReview = new Review(value);
    await newReview.save();

    data.reviews.push(newReview._id);
    await data.save();

    res.send(newReview);
})

router.delete("/:id", async (req, res) => {
    //delete review from parent and also itself.
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Not a valid review ID");

    const ParData = await Restaurant.findById(req.params.Rid);
    if (!ParData) return res.status(404).send("Invalid Restaurant ID") //not needed cuz of middlewear

    const ChildData = await Review.findByIdAndDelete(id);
    if (!ChildData) return res.status(404).send("Invalid Review ID")

    ParData.reviews = ParData.reviews.filter(e => !e.equals(id))
    await ParData.save();

    res.status(200).send("Review Deleted.")
})

router.patch("/:id", async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send("Not a valid review ID");

    const { error, value } = ReviewValidation.validate(req.body);
    if (error) return res.status(404).send(error.details);

    const data = await Review.findByIdAndUpdate(req.params.id, value, { new: true,});
    if (!data) return res.status(404).send("Invalid Review ID")

    await data.save();
    res.send(data);
})




export default router;