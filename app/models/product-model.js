const {Schema, model} = require("mongoose")

const productSchema = new Schema({
    name : String, 
    price: Number, 
    categoryId : {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    productImage:String
}, {timestamps : true})

const Product = model('Product', productSchema)

module.exports = Product