const User = require("../models/user-model")

const userRegistrationSchema = {
    name: {
        trim: true,
        exists: {
            errorMessage: 'name field is required'
        },
        notEmpty: {
            errorMessage: 'name field must have some value'
        }
    },
    email: {
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty: {
            errorMessage: 'email field must have some value'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'email value must be in valid email format'
        },
        custom: {
            options: async function (val) {
                const user = await User.findOne({ email: val })
                if (!user) {
                    return true
                } else {
                    throw new Error('EmailID already exists')
                }
            }
        }
    },
    password: {
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty: {
            errorMessage: 'password field must have some value'
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'password field value must be between 8-128 characters'
        },
        isStrongPassword: {
            errorMessage: 'password must have atleast one uppercase, one number and one special character'
        }
    }
}


module.exports = {
    userRegistrationSchema
}