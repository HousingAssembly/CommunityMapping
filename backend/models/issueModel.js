const mongoose = require('mongoose')

const issueModel = mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        category: {type: String, required: true},
        community: {type: String, required: true},
    },{
        timestamps: true, // Adds created at, updated at fields
    }
);

const Issue = mongoose.model("Issue", issueModel)

module.exports = Issue;
