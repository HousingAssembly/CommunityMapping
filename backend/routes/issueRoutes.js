const express = require('express')
const { createIssue, allIssues } = require('../controllers/issueController')

const router = express.Router()

router.route('/').post(createIssue)
router.get('/fetch', allIssues)

module.exports = router