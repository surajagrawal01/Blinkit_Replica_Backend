const Product = require("../models/product-model")

//third party packages
const _ = require("lodash")
const { validationResult } = require("express-validator")

const productCntrl = {}

//to create a product
productCntrl.create = async (req, res) => {

    //handler server side error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }

    const body = _.pick(req.body, ['name', 'price', 'categoryId'])
    try {
        const product1 = new Product(body)
        product1.productImage = req.file.filename
        await product1.save()
        res.json(product1)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}


//lists all the products
productCntrl.lists = async (req, res) => {
    try {
        const products = await Product.find().populate('categoryId', ['name','_id'])
        res.json(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

//delete the product
productCntrl.remove = async (req, res) => {
    const id = req.params.id
    try {
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            res.status(400).json({ error: 'record not found' })
        }
        res.json(product)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

//update the product 
productCntrl.update = async (req, res) => {
    const id = req.params.id
    const body = _.pick(req.body, ['name', 'price', 'categoryId'])
    try {
        const product = await Product.findByIdAndUpdate(id, { ...body, productImage: req.file.filename },
            { new: true })
        if (!product) {
            res.status(400).json({ error: 'record not found' })
        }
        res.json(product)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}


module.exports = productCntrl;