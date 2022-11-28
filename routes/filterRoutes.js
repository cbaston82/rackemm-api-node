const express = require('express')
const filterController = require('../controllers/filtersController')
const authController = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authController.requireSignin)

router.route('/').post(filterController.createFilter)

router.route('/').post(filterController.createFilter).get(filterController.getAllFilters)

router
    .route('/:id')
    .get(filterController.getAFilter)
    .delete(filterController.deleteAFilter)
    .patch(filterController.updateFilter)

module.exports = router
