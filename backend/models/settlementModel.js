const mongoose = require('mongoose')

const settlementModel = mongoose.Schema(
    {
        name: {type: String, required: true, unique:true},
        resourceContacts: {type: [String], required: true},
        waitingListSize: {type: Number, required: true},
        demographics: {type: [Number], required: true}, 
        // Make sure demographic info is ordered/accessed the same way every time!!
        issueCount: {type: Number, required: true},
        coords: {
            lat: { type: Number, required: true },
            long: { type: Number, required: true },
        },
        radius: {type: Number, required: true},
        communities: {type: [String], required: true},

    },{
        timestamps: true, // Adds created at, updated at fields
    }
);

const Settlement = mongoose.model("Settlement", settlementModel)

module.exports = Settlement;
