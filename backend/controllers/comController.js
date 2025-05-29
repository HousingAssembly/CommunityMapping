const Community = require("../models/communityModel.js");
const asyncHandler = require('express-async-handler')

const createCom = asyncHandler(async (req, res) => {
    const {name,districtName,coords} = req.body
    
    const comExists = await Community.findOne({ name })

    if (comExists) {
        res.status(400);
        throw new Error("Community already exists")
    }

    const com = await Community.create({
        name, districtName, coords
    })

    if(com){
        res.status(201).json({
            _id: com._id,           
            name: com.name,
            districtName: com.districtName,
            coords: com.coords
        })
    } else {
        res.status(400);
        throw new Error("Failed Creating User")
    }
})

const allComs = asyncHandler(async (req, res) => {
    try {
        const { district } = req.query;
        if (!district) return res.status(400).json({ msg: "district required" });

        const communities = await Community.find({ districtName: district })
        res.json(communities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "server error" });
    }
})

module.exports =  {createCom, allComs}