const mongoose = require('mongoose')

const generalInfoModel = mongoose.Schema(
    {
        haAddress: {type: String, required: true},
        haPhoneNum: {type: String, required: true},
        mayorOfficeAddress: {type: String, required: true},
        mayorAddressPhoneNum: {type: String, required: true},
        emergencyServices: {type: [String], required: true},
        currentHADistricts: {type: [String], required: true}

    },{
        timestamps: true, // Adds created at, updated at fields
    }
);

const GeneralInfo = mongoose.model("General Info", generalInfoModel)

module.exports = Issue;
