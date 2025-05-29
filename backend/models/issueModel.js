const mongoose = require('mongoose')

const issueModel = mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        tag: {type: HousingType = {
            GBV: "GBV",
            EVICTIONS: "Eviction",
            FOOD: "Need Food/Water/Electricity",
            CRIME: "Crime",
            NATLDISTASER: "Natural Disaster",
            CONDITIONS: "Poor Housing Conditions",
            OTHER: "Other",
        },
        required: true},
        setttlement: {type: String, required: true},
    },{
        timestamps: true, // Adds created at, updated at fields
    }
);

const Issue = mongoose.model("Issue", issueModel)

module.exports = Issue;
