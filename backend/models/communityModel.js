const mongoose = require('mongoose')

const communityModel = mongoose.Schema(
    {
        name: {type: String, required: true, unique:true},
        districtName: {type: String, required: true},
        waitingListSize: {type: Number, required: false},
        demographics: {type: [Number], required: false}, 
        // Make sure demographic info is ordered/accessed the same way every time!!
        issueCount: {type: Number, required: false},
        coords: {
            lat: { type: Number, required: true },
            long: { type: Number, required: true },
        },
    },{
        timestamps: true, // Adds created at, updated at fields
    }
);

const Community = mongoose.model("Settlement", communityModel)

module.exports = Community;
