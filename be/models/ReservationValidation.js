import joi from "joi";

const ReservationValidation = joi.object({
    userID: joi.string(),
    restaurantID: joi.string(),
    reservationDate: joi.string(),
    seats: joi.number(),
    status:joi.string(),
})

export default ReservationValidation;