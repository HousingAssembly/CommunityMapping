const Community = require("../models/communityModel.js");
const asyncHandler = require('express-async-handler')

const createCom = asyncHandler(async (req, res) => {
    const {name,districtName,coordinates} = req.body
    
    const comExists = await User.findOne({ name })

    if (comExists) {
        res.status(400);
        throw new Error("Community already exists")
    }

    const com = await Community.create({
        name, districtName, coordinates
    })

    if(com){
        res.status(201).json({
            _id: com._id,           
            name: com.name,
            districtName: com.districtName,
            coords: com.coordinates
        })
    } else {
        res.status(400);
        throw new Error("Failed Creating User")
    }
})

module.exports =  {createCom}