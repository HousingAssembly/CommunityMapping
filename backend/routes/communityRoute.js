const express = require('express')
const { createCom, allComs, deleteCom, updateCom } = require('../controllers/comController')

const router = express.Router()

router.route('/').post(createCom)
router.get('/fetch', allComs)
router.put("/:id", updateCom);
router.delete("/:id", deleteCom);

module.exports = router