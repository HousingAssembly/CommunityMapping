const express = require('express')
const { createCom, allComs, deleteCom, updateCom } = require('../controllers/comController')
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.get('/fetch', allComs)
router.route('/').post(protect, createCom)
router.put("/:id",protect, updateCom);
router.delete("/:id",protect, deleteCom);

module.exports = router