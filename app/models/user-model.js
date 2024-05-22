const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    name: String,
    email: String,
    role: String,
    password: String,
    location: {
        houseNumber: String,
        locality: String,
        area: String,
        pincode: String,
        city: String,
        state: String,
        country: String,
    },
    geoLocation: {
        lat: String,
        lng: String,
    },
    cartItems: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ]
}, { timestamps: true })

const User = model('User', userSchema)

module.exports = User 