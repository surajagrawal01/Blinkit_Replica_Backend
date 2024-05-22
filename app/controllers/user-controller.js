const User = require("../models/user-model")

//third party packages
const _ = require("lodash")
const bcryptjs = require("bcryptjs")
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const axios = require("axios")

//user-controller
const userCntrl = {}

//creating a user 
userCntrl.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }
    try {
        const body = _.pick(req.body, ['name', 'email', 'password', 'location'])
        const user = new User(body)

        const addressBody = _.pick(req.body.location, ['houseNumber', 'locality', 'area', 'city', 'state', 'pincode', 'country'])

        const searchString = `${addressBody.locality}, ${addressBody.area}, ${addressBody.city}, ${addressBody.pincode}, ${addressBody.state}, ${addressBody.country}`

        const mapResponse = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchString}&apiKey=${process.env.GEO_APIFYKEY}`)

        if (mapResponse.data.features.length == 0) {
            return res.status(400).json({ errors: [{ msg: "Invalid address", path: 'invalid address' }] })
        }
        const location = {lat : mapResponse.data.features[0].properties.lat, lng: mapResponse.data.features[0].properties.lon}
        
        user.geoLocation = location
        //role implementation
        const countDocuments = await User.countDocuments()
        if (countDocuments === 0) {
            user.role = 'admin'
        } else {
            user.role = 'user'
        }

        //password hassing
        const saltValue = await bcryptjs.genSalt()
        const encryptedPassword = await bcryptjs.hash(user.password, saltValue)
        user.password = encryptedPassword

        await user.save()
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json('Internal server error')
    }
}

userCntrl.login = async (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])
    try {
        const user = await User.findOne({ email: body.email })
        if (!user) {
            return res.status(400).json({ error: 'invalid emailid/password' })
        }
        const passwordCheck = await bcryptjs.compare(body.password, user.password)
        if (!passwordCheck) {
            return res.status(400).json({ error: 'invalid email/password' })
        }
        const payloadData = {
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(payloadData, process.env.JWT_SECRET_KEY, { expiresIn: '14d' })
        res.json({ token: token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

userCntrl.list = async(req, res)=>{
    try{
        const user = await User.findById(req.user.id)
        res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

userCntrl.addItem = async(req, res)=>{
    const body = req.body
    try{
        const user = await User.findById(req.user.id)
        user.cartItems = [...user.cartItems, body]
        await user.save()
        res.json(body)
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

userCntrl.updateItem = async(req, res)=>{
    const type = req.query.type
    const id = req.params.id
    try{
        if(type == 'inc'){
            const user = await User.findOneAndUpdate(
                { _id: req.user.id, 'cartItems.productId': id },
                { $inc: { 'cartItems.$.quantity': 1 } },
                { new: true }
            );
            return res.json(user.cartItems)
        }else if(type == 'dec'){
            const user = await User.findOneAndUpdate(
                { _id: req.user.id, 'cartItems.productId': id },
                { $inc: { 'cartItems.$.quantity': -1 } },
                //{ $inc: { 'cartItems.$.quantity': 1 } }: The $ positional operator references the element in the array that matched the query condition. This ensures that only the quantity field of the matched cartItem is incremented by 1.
                { new: true })
            res.json(user.cartItems)
        }else{
            console.log(id)
            const user = await User.findOneAndUpdate(
                { _id: req.user.id },
                //The $pull operator removes from an array all elements that match a specified condition.
                { $pull: { cartItems: { productId: id } } },
                { new: true }
              );
            res.json(user.cartItems)
        }
    }catch(err){

    }
}

module.exports = userCntrl