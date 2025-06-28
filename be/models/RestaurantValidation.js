import joi from "joi"

const validation = joi.object({
    title : joi.string().required(),
    location: joi.string().required(),
    description: joi.string().required(),
    rating:joi.number(),
    reviews: joi.array(),
})


export default validation