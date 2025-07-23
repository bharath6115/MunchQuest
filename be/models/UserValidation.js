import joi from "joi";

const userValidation = joi.object({
    username: joi.string(),
    uid: joi.string(),
    email:joi.string(),
    notifications:joi.array(),
})

export default userValidation;