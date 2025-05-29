const mongoose = require('mongoose')
const bcrypt = require('bcryptjs'); // Handles hashing 

const userModel = mongoose.Schema(
    {
        email: {type: String, required: true, unique:true},
        password: {type: String, required: true},
    },{
        timestamps: true, // Adds created at, updated at fields
    }
);

// Compare plain-text password to the hashed one in the DB
userModel.methods.matchPassword= async function(enteredPassword){ // Method adds custom function on model instances
    return await bcrypt.compare(enteredPassword, this.password) // This is the encrypted pw
}

// Checks for password modifications or new users to regenerate hashing
userModel.pre('save', async function(next){ // save is the event name (before saving a user to the DB, run this function)
    if (!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userModel)

module.exports = User;
