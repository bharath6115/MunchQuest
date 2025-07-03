import joi from "joi"

const validation = joi.object({
    owner : joi.string(),
    title : joi.string().required(),
    location: joi.string().required(),
    description: joi.string().required(),
    rating:joi.number(),
    reviews: joi.array(),
    images: joi.array(),
    menu: joi.array(),
})


export default validation