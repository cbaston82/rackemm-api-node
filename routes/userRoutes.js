const express = require('express')

const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const userController = require('../controllers/userController')

router.patch(
    '/updateMe',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('free', 'subscriber', 'administrator'),
    userController.updateMe,
)

router.delete(
    '/deleteMe',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('free', 'subscriber', 'administrator'),
    userController.deleteMe,
)

router.get(
    '/me',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('free', 'subscriber', 'administrator'),
    userController.getMe,
)

router
    .route('/')
    .get(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('administrator'),
        userController.getUsers,
    )
    .post(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('administrator'),
        userController.createUser,
    )

router
    .route('/:id')
    .delete(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('administrator'),
        userController.deleteUser,
    )
    .get(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('administrator'),
        userController.getUser,
    )
    .patch(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('administrator'),
        userController.updateUser,
    )

module.exports = router
