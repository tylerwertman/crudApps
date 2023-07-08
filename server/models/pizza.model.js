const mongoose = require('mongoose')
const { findOneUser } = require('../controllers/user.controller')

const PizzaSchema = new mongoose.Schema({
    orderType: {
        type: String,
        required: [true, "Order Type is required"],
        enum: ["Delivery", "Take Out", "Dine In"],
        default: "Delivery"
    },
    size: {
        type: String,
        required: [true, "Size is required"],
        enum: ["Large", "Medium", "Small"],
        default: "Large"
    },
    crust: {
        type: String,
        enum: ["Thin crust", "Regular crust", "Cheese-filled crust", "Cauliflower crust"],
        required: [true, "Crust type is required"],
        default: "Thin crust"
    },
    qty: {
        type: Number,
        required: [true, "Quantity is reequired"],
        default: 1
    },
    toppings: {
        "Pepperoni": { type: Boolean, default: false },
        "Extra Cheese": { type: Boolean, default: false },
        "Sausage": { type: Boolean, default: false },
        "Anchovies": { type: Boolean, default: false },
        "Green Olives": { type: Boolean, default: false },
        "Black Olives": { type: Boolean, default: false },
        "Mushrooms": { type: Boolean, default: false },
        "Broccoli": { type: Boolean, default: false },
        "Buffalo Chicken": { type: Boolean, default: false },
        "Chicken Bacon Ranch": { type: Boolean, default: false },
        "Teriyaki Chicken": { type: Boolean, default: false },
        "Ham Pineapple": { type: Boolean, default: false },
    },
    orderedByString: {
        type: String
    },
    // orderedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: [true, "Added-By field is required"]
    // },
    // favoritedBy: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // }]
},
    { timestamps: true }
)

module.exports = mongoose.model('Pizza', PizzaSchema)