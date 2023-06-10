const mongoose = require('mongoose');
const { findOneUser } = require('../controllers/user.controller');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [2, "Title must be at least 2 characters"]
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        minlength: [2, "Author must be at least 2 characters"]
    },
    addedByString: {
        type: String
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Added-By field is required"]
    },
    favoritedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
    { timestamps: true }
);

module.exports = mongoose.model('Book', BookSchema);