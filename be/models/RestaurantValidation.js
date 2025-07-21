import joi from "joi"

const validation = joi.object({
    owner : joi.string(),
    title : joi.string(),
    location: joi.string(),
    description: joi.string(),
    rating:joi.number(),
    reserveSeat: joi.string(),
    isVerified: joi.boolean(),
    reviews: joi.array(),
    images: joi.array(),
    menu: joi.array(),
})


export default validation