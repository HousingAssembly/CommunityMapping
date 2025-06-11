const express = require('express')
const { createIssue, allIssues, deleteIssue } = require('../controllers/issueController')
const { protect } = require("../middleware/authMiddleware")


const router = express.Router()

router.route('/').post(createIssue)
router.get('/fetch', allIssues)
router.delete('/delete', protect, deleteIssue)


module.exports = router