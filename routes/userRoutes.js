const express = require('express')

const router = express.Router()
const authController = require('../middleware/authMiddleware')
const userController = require('../controllers/userController')

router
    .route('/')
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        userController.getUsers,
    )
    .post(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        userController.createUser,
    )

router
    .route('/:id')
    .delete(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        userController.deleteUser,
    )
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        userController.getUser,
    )
    .patch(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        userController.updateUser,
    )

module.exports = router
