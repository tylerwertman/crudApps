const Pizza = require("../models/pizza.model");
const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const secret = process.env.FIRST_SECRET_KEY;


module.exports.findAllPizzas = (req, res) => {
    Pizza.find()
        .then(allPizzas => res.json({ pizza: allPizzas }))
        .catch(err => res.status(400).json({ message: "Something went worng finding all pizzas", error: err }))
}
module.exports.findOnePizza = (req, res) => {
    Pizza.findById(req.params.id)
        .then(onePizza => res.json({ pizza: onePizza }))
        .catch(err => res.status(400).json({ message: "Something went worng finding one pizza", error: err }))
}
module.exports.createPizza = async (req, res) => {
    try {
        const {_id, displayName} = jwt.verify(req.cookies.userToken, secret)
        const myPizza = new Pizza(req.body)
        console.log(req.body)
        myPizza.orderedByString = displayName
        let newPizza = await myPizza.save()
        await User.findByIdAndUpdate(_id, {$push: {favoritePizza: newPizza._id}})
        res.json({ pizza: newPizza })
    }catch(err){
        console.log(`inside catch`, err)
        res.status(400).json({ message: "Something went worng creating a pizza", error: err })
    }
}
module.exports.updatePizza = (req, res) => {
    Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then(updatedPizza => {
            res.json({ pizza: updatedPizza })
            console.log("Successfully updated a pizza", updatedPizza)
        })
        .catch(err => res.status(400).json({ message: "Something went worng updating a pizza", error: err }))
}
module.exports.deletePizza = (req, res) => {
    Pizza.findByIdAndDelete(req.params.id)
        .then(result => res.json({ result: result }))
        .catch(err => res.status(400).json({ message: "Something went worng deleting a pizza", error: err }))
}
module.exports.deleteAllPizzas = (req, res) => {
    Pizza.deleteMany()
        .then(result => res.json({ result: result }))
        .catch(err => res.status(400).json({ message: "Something went worng deleting all pizzas", error: err }))
}
module.exports.favorite = async (req, res) => {
    const {_id} = jwt.verify(req.cookies.userToken, secret)
    try {
        const updatedPizza = await Pizza.findByIdAndUpdate(req.params.id, {$push: {favoritedBy: _id}}, { new: true })
        await User.findByIdAndUpdate(_id, {$push: {pizzasFavorited: req.params.id}})
        res.json({ pizza: updatedPizza })
    }catch(err){
        res.status(400).json({ message: "Something went worng favoriting a pizza", error: err }) //error isnt specific to either try line
    }
}
module.exports.unfavorite = async (req, res) => {
    const {_id} = jwt.verify(req.cookies.userToken, secret)
    try {
        const updatedPizza = await Pizza.findByIdAndUpdate(req.params.id, {$pull: {favoritedBy: _id}}, { new: true })
        await User.findByIdAndUpdate(_id, {$pull: {pizzasFavorited: req.params.id}})
        res.json({ pizza: updatedPizza })
    }catch(err){
        res.status(400).json({ message: "Something went worng favoriting a pizza", error: err }) //error isnt specific to either try line
    }
}