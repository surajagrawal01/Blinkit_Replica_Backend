const Category = require("../models/category-model")
const {validationResult} = require("express-validator")

const categoryCntrl = {}

//creating a category
categoryCntrl.create = async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }
    const body = req.body
    try{
        const category = new Category(body)
        await category.save()
        res.json(category)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

categoryCntrl.lists = async(req, res)=>{
    try{
        const categories = await Category.find()
        res.json(categories)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

module.exports = categoryCntrl;