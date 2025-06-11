const mongoose = require('mongoose')

const communityModel = mongoose.Schema(
    {
        name: {type: String, required: true, unique:true},
        districtName: {type: String, required: true},
        issueCount: {type: Number, required: false},
        coords: {
            lat: { type: Number, required: true },
            long: { type: Number, required: true },
        },
        housingStats: {
            RDPs:              { type: String, default: 'Not Entered' },
            CRUs:              { type: String, default: 'Not Entered' },
            backyardDwellings: { type: String, default: 'Not Entered' },
        },

        demographics: {
            total:    { type: String, default: 'Not Entered' },
            black:    { type: String, default: 'Not Entered' },
            coloured: { type: String, default: 'Not Entered' },
            asian:    { type: String, default: 'Not Entered' },
            white:    { type: String, default: 'Not Entered' },
            other:    { type: String, default: 'Not Entered' },
        },
    },{
        timestamps: true,
    }
);

const Community = mongoose.model("Settlement", communityModel)

module.exports = Community;
