import express from "express";
import mongoose from "mongoose";
import Reservation from "../models/Reservation.js";
import ReservationValidation from "../models/ReservationValidation.js";

const router = express.Router();

// get all reservations
router.get("/", async (req, res) => {
    const reservations = await Reservation.find();
    res.send(reservations);
});

// get reservations by user
router.get("/user/:uid", async (req, res) => {
    const { uid } = req.params;
    const reservations = await Reservation.find({ userID: uid });
    res.send(reservations);
});

// get reservations of restaurant
router.get("/restaurant/:rid", async (req, res) => {
    const { rid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(rid)) return res.status(400).send("Invalid restaurant ID");

    const reservations = await Reservation.find({ restaurantID: rid });
    res.send(reservations);
});

// add new reservation
router.post("/", async (req, res) => {
    const { restaurantID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(restaurantID)) return res.status(400).send("Invalid Restaurant ID");

    const { value, error } = ReservationValidation.validate(req.body);
    if (error) return res.status(400).send(error.details);

    const data = new Reservation(value);
    await data.save();

    res.send(data);
});

// update reservation status
router.patch("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid reservation ID");

    const { value, error } = ReservationValidation.validate(req.body);
    if (error) return res.status(400).send(error.details);

    const updated = await Reservation.findByIdAndUpdate(id, value, { new: true, runValidators: true });
    if (!updated) return res.status(404).send("Reservation not found");

    res.send(updated);
});

//delete stale reservations
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid reservation ID");

    await Reservation.findByIdAndDelete(id);

    res.status(200).json({ message: "Deleted" });
})

export default router;
