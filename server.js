require("dotenv").config()

//third party packages 
const express = require("express")
const multer = require("multer")
const cors = require("cors")
const { checkSchema } = require("express-validator")
const app = express()
app.use(express.json())
app.use(cors())
app.use('/images', express.static('./public/images'));
const portNo = process.env.port || 3090


//db configuration 
const dbConfig = require("./config/dbConfig")
dbConfig()

//authorization and authentication
const {authenticateUser, authorizeUser} = require("./app/middleware/auth")

//multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})


//user controllers and validations
const userCntrl = require("./app/controllers/user-controller")
const categoryCntrl = require("./app/controllers/category-controller")
const productCntrl = require("./app/controllers/product-controller")

//validationschemas
const { userRegistrationSchema } = require("./app/validators/user-validation")
const categoryValidationSchema = require("./app/validators/category-validation")
const productValidationSchema = require("./app/validators/product-validation")

//user-registration
app.post("/api/users", checkSchema(userRegistrationSchema), userCntrl.create)
app.post("/api/users-login", userCntrl.login)
app.get("/api/users", authenticateUser, authorizeUser(['user']), userCntrl.list)

//category-crud
app.post("/api/categories",authenticateUser, authorizeUser(['admin']), 
        checkSchema(categoryValidationSchema), categoryCntrl.create)
app.get("/api/categories", categoryCntrl.lists)

//product-crud
app.post("/api/products",authenticateUser, authorizeUser(['admin']), upload.single('image'),
        checkSchema(productValidationSchema), productCntrl.create)
app.get("/api/products", productCntrl.lists)
app.delete("/api/products/:id",authenticateUser, authorizeUser(['admin']), productCntrl.remove)
app.put("/api/products/:id",authenticateUser, authorizeUser(['admin']),upload.single('image'), 
        productCntrl.update)

//cart-item update operations
app.put("/api/cart-items", authenticateUser, authorizeUser(['user']), userCntrl.addItem)
app.put("/api/cart-items/changes/:id", authenticateUser, authorizeUser(['user']), userCntrl.updateItem)
app.put("/api/cart-items/clear", authenticateUser, authorizeUser(['user']), userCntrl.clearCart)


app.listen(portNo, () => {
    console.log(`Server running on port ${portNo}`)
})