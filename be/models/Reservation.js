import mongoose from "mongoose"

const ReservationSchema = new mongoose.Schema({
    userID: {
        type: String,   //firebase ID
        required: true,
    },
    restaurantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    reservationDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "cancelled"],
        default: "active",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Reservation = mongoose.model("Reservation", ReservationSchema);

export default Reservation;