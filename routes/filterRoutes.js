const express = require('express')
const filterController = require('../controllers/filtersController')
const authController = require('../middleware/authMiddleware')

const router = express.Router()

router
    .route('/')
    .post(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        filterController.createFilter,
    )
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        filterController.getAllFilters,
    )

router
    .route('/:id')
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        filterController.getAFilter,
    )
    .delete(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        filterController.deleteAFilter,
    )

module.exports = router
