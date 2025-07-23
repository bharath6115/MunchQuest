import express from "express"
import mongoose from "mongoose"
import override from "method-override"
import cors from "cors"
import restaurantsRouter from "./routes/restaurants.js"
import reviewsRouter from "./routes/reviews.js"
import menuRouter from "./routes/menu.js"
import userRouter from "./routes/user.js"
import notificationRouter from "./routes/notification.js"
import dotenv from "dotenv"
dotenv.config();
let URL = "mongodb://localhost:27017/MunchQuest"
URL = process.env.DB_URL


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(override("_method"));


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

app.use("/restaurants",restaurantsRouter)
app.use("/restaurants/:Rid/reviews",reviewsRouter)
app.use("/restaurants/:Rid/menu",menuRouter)
app.use("/users",userRouter)
app.use("/users/:uid/notifications",notificationRouter)
