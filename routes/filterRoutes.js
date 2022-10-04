const express = require('express')
const filterController = require('../controllers/filtersController')
const authController = require('../middleware/authMiddleware')

const router = express.Router()

// AUTH ROUTES
router
    .route('/')
    .post(
        authController.requireSignin,
        authController.restrictTo('subscriber', 'administrator'),
        filterController.createFilter,
    )
    .get(
        authController.requireSignin,
        authController.restrictTo('subscriber', 'administrator'),
        filterController.getAllFilters,
    )

router
    .route('/:id')
    .get(
        authController.requireSignin,
        authController.restrictTo('subscriber', 'administrator'),
        filterController.getAFilter,
    )
    .delete(
        authController.requireSignin,
        authController.restrictTo('subscriber', 'administrator'),
        filterController.deleteAFilter,
    )
    .patch(
        authController.requireSignin,
        authController.restrictTo('subscriber', 'administrator'),
        filterController.updateFilter,
    )

module.exports = router
