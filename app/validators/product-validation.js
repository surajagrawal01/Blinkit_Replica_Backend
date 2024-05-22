const Product = require("../models/product-model");

const productValidationSchema = {
    name:{
        exists:{
            errorMessage:'name field is required'
        },
        notEmpty:{
            errorMessage:'name field should not be empty'
        },
        custom: {
            options: async function (val) {
                const product = await Product.findOne({ name: val })
                if (!product) {
                    return true
                } else {
                    throw new Error('Product Already Exists')
                }
            }
        }
    },
    price:{
        exists:{
            errorMessage:'price field is required'
        },
        notEmpty:{
            errorMessage:'price field should not be empty'
        },
        isNumeric:{
            errorMessage:'price field value must be number'
        }
    },
    categoryId:{
        exists:{
            errorMessage:'categoryId field is required'
        },
        notEmpty:{
            errorMessage:'categoryId field should not be empty'
        },
        isMongoId:{
            errorMessage:'must be a mongoId'
        }
    }
}

module.exports = productValidationSchema;