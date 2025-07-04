//simplifies error handling
const asyncHandler = require('express-async-handler')
//make unique tokens
const generateToken = require("../config/generateToken")
//schema
const User = require("../models/userModel.js");

const registerUser = asyncHandler(async (req, res) => {
    const {email,password} = req.body
    if ( !email || !password){
        res.status(400)
        throw new Error('Please Enter all the Fields')
    }
    const userExists = await User.findOne({ email })

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
        email, password,
    })

    if(user){
        res.status(201).json({
            _id: user._id,           
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("Failed Creating User")
    }
})


const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({ email })

    if(user && (await user.matchPassword(password))){
        res.status(201).json({
            _id: user._id,           
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("Invalid Email or Password")

    }
})

module.exports =  {authUser, registerUser}