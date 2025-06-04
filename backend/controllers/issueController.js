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
////////////////////////////
const allIssues = asyncHandler(async (req, res) => {
    const { community } = req.query
    if (!community) {
        return res.status(400).json({ msg: "community query parameter required" })
    }

    try {
        // Find all Issue docs where `community` matches the query string
        const issues = await Issue.find({ community })
        res.json(issues)
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: "Server error" })
    }
})

const deleteIssue = async (req, res) => {
  try {
    const {id} = req.body
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) return res.status(404).json({ msg: "Issue found" });

    res.json({ msg: "Deleted", id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = {createIssue, allIssues, deleteIssue}
