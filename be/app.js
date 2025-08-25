import express from "express"
import mongoose from "mongoose"
import override from "method-override"
import cors from "cors"
import { v2 as cloudinary } from "cloudinary"
import restaurantsRouter from "./routes/restaurants.js"
import reviewsRouter from "./routes/reviews.js"
import menuRouter from "./routes/menu.js"
import userRouter from "./routes/user.js"
import notificationRouter from "./routes/notification.js"
import reservationRouter from "./routes/reservations.js"
import dotenv from "dotenv"

dotenv.config();
let URL = "mongodb://localhost:27017/MunchQuest"
URL = process.env.DB_URL

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(override("_method"));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.listen(process.env.PORT, () => { console.log("Backend is Live") })
mongoose.connect(URL)
    .then(() => console.log("Database connected."))
    .catch(e => { console.log(e) });

const config = {
    origin: `${process.env.FRONTEND_URL}`
}

app.use(cors(config));

app.get("/", (req, res) => {
    res.send("HOME");
})

app.get("/getSignature", (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "munchQuest/upload";

    const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET);

    res.json({
        timestamp,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        folder
    });
});

app.post("/deleteImageInCloudinary", async (req, res) => {
    const { removedImages } = req.body;
    try {
        const results = await Promise.all(
            removedImages.map(async (ele) => {
                if (ele.id === "null") return null;
                return await cloudinary.uploader.destroy(ele.id);
            })
        );
        res.status(200).json({ message: "Images deleted successfully", results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use("/restaurants", restaurantsRouter)
app.use("/restaurants/:Rid/reviews", reviewsRouter)
app.use("/restaurants/:Rid/menu", menuRouter)
app.use("/users", userRouter)
app.use("/users/:uid/notifications", notificationRouter)
app.use("/reservations", reservationRouter)
