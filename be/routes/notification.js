import express from "express"
import User from "../models/Users.js"
import notificationValidation from "../models/NotificationValidation.js"

const router = express.Router({ mergeParams: true })


router.use(async (req, res, next) => {
    const data = await User.findOne({ uid: req.params.uid });
    if (!data) return res.send("Invalid uid!");
    req.userData = data;         //Save the userData in req.userData to prevent multiple findings
    next();
})

router.get("/", async (req, res) => {
    res.send(req.userData.notifications);
})

router.post("/", async (req, res) => {
    const data = req.userData;
    const { value, error } = notificationValidation.validate(req.body);
    if (error) return res.status(404).send("Invalid notification data")

    data.notifications.push(value);
    await data.save();

    res.send(data.notifications);
})

router.patch("/:id", async (req, res) => {
    const data = req.userData;

    const notif = data.notifications.id(req.params.id);                     //subdoc id searcher.
    if (!notif) return res.status(404).send("Notification not found");
    
    notif.isRead = true;
    await data.save();
    
    res.send(data.notifications);
})

router.delete("/:id", async (req, res) => {
    const data = req.userData;
    data.notifications = data.notifications.filter((n) => n._id.toString() !== req.params.id);
    await data.save();
    res.send(data.notifications);
})

export default router;