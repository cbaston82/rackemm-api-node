const express = require('express')

const router = express.Router()
const authController = require('../middleware/authMiddleware')
const userController = require('../controllers/userController')
const { updateMeValidator } = require('../validators/updateMeValidator')

router.patch(
    '/update-me/',
    authController.requireSignin,
    authController.restrictTo('free-user', 'subscribed-user', 'admin-user'),
    updateMeValidator,
    userController.updateMe,
)

router.delete(
    '/delete-me/',
    authController.requireSignin,
    authController.restrictTo('free-user', 'subscribed-user', 'admin-user'),
    userController.deleteMe,
)

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
