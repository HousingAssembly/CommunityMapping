const Issue = require("../models/issueModel.js");
const asyncHandler = require('express-async-handler')

const createIssue = asyncHandler(async (req, res) => {
    const {title, category, description, community} = req.body
    
    const issue = await Issue.create({
        title, category, description, community
    })

    if(issue){
        res.status(201).json({
            _id: issue._id,           
            title: issue.title,
            category: issue.category,
            description: issue.description,
            community: issue.community
        })
    } else {
        res.status(400);
        throw new Error("Failed Creating Issue")
    }
})

module.exports = {createIssue}
