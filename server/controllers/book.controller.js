const Book = require("../models/book.model");
const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const secret = process.env.FIRST_SECRET_KEY;


module.exports.findAllBooks = (req, res) => {
    Book.find()
        .populate("addedBy favoritedBy")
        .then(allBooks => res.json({ book: allBooks }))
        .catch(err => res.status(400).json({ message: "Something went worng finding all books", error: err }))
}
module.exports.findOneBook = (req, res) => {
    Book.findById(req.params.id)
        .populate("addedBy favoritedBy")
        .then(oneBook => res.json({ book: oneBook }))
        .catch(err => res.status(400).json({ message: "Something went worng finding one book", error: err }))
}
module.exports.createBook = async (req, res) => {
    try {
        const {_id, displayName} = jwt.verify(req.cookies.userToken, secret)
        const myBook = new Book(req.body)
        myBook.addedBy = _id
        myBook.addedByString = displayName
        myBook.favoritedBy.push(_id)
        let newBook = await myBook.save()
        await newBook.populate("addedBy favoritedBy")
        await User.findByIdAndUpdate(newBook.addedBy, {$push: {booksAdded: newBook._id, booksFavorited: newBook._id}})
        res.json({ book: newBook })
        // console.log("inside try")
    }catch(err){
        console.log(`inside catch`, err)
        res.status(400).json({ message: "Something went worng creating a book", error: err }) //error isnt specific to either try line
    }
}
module.exports.updateBook = (req, res) => {
    Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .populate("addedBy favoritedBy")
        .then(updatedBook => {
            res.json({ book: updatedBook })
            console.log("Successfully updated a book", updatedBook)
        })
        .catch(err => res.status(400).json({ message: "Something went worng updating a book", error: err }))
}
module.exports.deleteBook = (req, res) => {
    Book.findByIdAndDelete(req.params.id)
        .then(result => res.json({ result: result }))
        .catch(err => res.status(400).json({ message: "Something went worng deleting a book", error: err }))
}
module.exports.deleteAllBooks = (req, res) => {
    Book.deleteMany()
        .then(result => res.json({ result: result }))
        .catch(err => res.status(400).json({ message: "Something went worng deleting all books", error: err }))
}
module.exports.favorite = async (req, res) => {
    const {_id} = jwt.verify(req.cookies.userToken, secret)
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {$push: {favoritedBy: _id}}, { new: true })
        await updatedBook.populate("addedBy favoritedBy")
        await User.findByIdAndUpdate(_id, {$push: {booksFavorited: req.params.id}})
        res.json({ book: updatedBook })
    }catch(err){
        res.status(400).json({ message: "Something went worng favoriting a book", error: err }) //error isnt specific to either try line
    }
}
module.exports.unfavorite = async (req, res) => {
    const {_id} = jwt.verify(req.cookies.userToken, secret)
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {$pull: {favoritedBy: _id}}, { new: true })
        await updatedBook.populate("addedBy favoritedBy")
        await User.findByIdAndUpdate(_id, {$pull: {booksFavorited: req.params.id}})
        res.json({ book: updatedBook })
    }catch(err){
        res.status(400).json({ message: "Something went worng favoriting a book", error: err }) //error isnt specific to either try line
    }
}