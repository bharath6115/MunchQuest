import express from "express"
import mongoose from "mongoose"
import override from "method-override"
import cors from "cors"
import restaurantsRouter from "./routes/restaurants.js"
import reviewsRouter from "./routes/reviews.js"
import menuRouter from "./routes/menu.js"

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(override("_method"));


app.listen(3001, () => { console.log("Backend Listening on https://localhost:3001") })
mongoose.connect("mongodb://localhost:27017/MunchQuest")
    .then(() => console.log("d.e db connected."))
    .catch(e => { console.log(e) });

const config = {
    origin: "http://localhost:5173"
}
app.use(cors(config));

app.get("/", (req, res) => {
    res.send("HOME");
})

app.use("/restaurants",restaurantsRouter)
app.use("/restaurants/:Rid/reviews",reviewsRouter)
app.use("/restaurants/:Rid/menu",menuRouter)
