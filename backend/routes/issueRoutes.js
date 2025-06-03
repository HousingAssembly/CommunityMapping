const express = require('express')
const { createIssue } = require('../controllers/issueController')

const router = express.Router()

router.route('/').post(createIssue)


module.exports = router