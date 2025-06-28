import express from "express"
import Review from "../models/Review.js"
import Restaurant from "../models/Restaurant.js"

const router = express.Router({mergeParams:true});

/*
1.Fetch all reviews
2.Fetch single review
3.Create new review
4.Delete a review
5.Modify a review
*/

//Validate the Restaurant ID.
router.use((req,res,next)=>{
    if(mongoose.Types.ObjectId.isValid(req.params.Rid)) return res.status(404).send("Not a valid Restaurant ID!")
    next();
})


router.get("/", async (req,res)=>{
    const data = await Restaurant.findById(req.params.Rid).populate("reviews");
    res.send(data.reviews);
})

router.get("/:id", async (req,res)=>{
    const data = await Review.findById(req.params.id);
    res.send(data);
})

router.post("/", async (req,res)=>{
    const data = await Restaurant.findById(req.params.Rid);
    const newReview = new Review(req.body);
    await newReview.save();
    data.reviews.push(newReview);
    await data.save();
    res.send(newReview);
})

router.delete("/:id", async (req,res)=>{
    //delete review from parent and also itself.
    const {id} = req.params;
    const ParData = await Restaurant.findById(req.params.Rid);
    const ChildData = await Review.findByIdAndDelete(id);

    ParData.reviews = ParData.reviews.filter((e)=>{
        if(!e.equals(id)) return e;
    })
    await ParData.save();
    res.status(200).send("Review Deleted.")

})

router.patch("/:id", async(req,res)=>{

    const data = await Review.findByIdAndUpdate(req.params.id,req.body);

    await data.save();
    res.send(data);
})




export default router;