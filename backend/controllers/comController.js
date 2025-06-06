const Community = require("../models/communityModel.js");
const asyncHandler = require('express-async-handler')

const createCom = asyncHandler(async (req, res) => {
    const {name,districtName,coords, housingStats, demographics} = req.body
    
    const comExists = await Community.findOne({ name })

    if (comExists) {
        res.status(400);
        throw new Error("Community already exists")
    }

    const form = {
        name,
        coords,
        districtName,
        housingStats,
        demographics,
    };

    const com = await Community.create(form)

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

const updateCom = async (req, res) =>{
    try {
    const { name, coords, housingStats, demographics } = req.body;

    const updated = await Community.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(coords && {
          coords: {
            lat: coords.lat,
            long: coords.long,
          },
        }),
        ...(housingStats && { housingStats }),
        ...(demographics && { demographics }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Community not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const deleteCom = async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community) return res.status(404).json({ msg: "Not found" });

    res.json({ msg: "Deleted", id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
};


module.exports =  {createCom, allComs, deleteCom, updateCom}