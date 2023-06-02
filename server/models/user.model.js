const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    displayName: {
        type: String,
        required: [true, "Display name is required"],
        unique: [true, "Display name already Exists"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        validate: [isEmail, "Please enter a valid email"]

    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be 8 characters or longer"]
    },
    booksAdded: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }],
    booksFavorited: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }],
    ideasAdded: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea"
    }],
    ideasFavorited: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea"
    }]
}, { timestamps: true });

UserSchema.virtual('confirmPassword')
    .get(()=>this.confirmPassword)
    .set(value=>this.confirmPassword = value)

UserSchema.pre('validate', function(next) {
    if(this.password != this.confirmPassword){
        this.invalidate('confirmPassword', 'Password must match confirm password')
    }
    next()
})

UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
        .then(hash=>{
            this.password = hash;
            next()
        })
    })

module.exports = mongoose.model("User", UserSchema)