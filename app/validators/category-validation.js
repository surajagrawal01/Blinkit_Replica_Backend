const Category = require("../models/category-model")

const categoryValidationSchema = {
    name:{
        exists:{
            errorMessage:'name field is required'
        },
        notEmpty:{
            errorMessage:'name field should not be empty'
        },
        custom: {
            options: async function (val) {
                const category = await Category.findOne({ name: val })
                if (!category) {
                    return true
                } else {
                    throw new Error('category already exists')
                }
            }
        }
    }
}

module.exports = categoryValidationSchema