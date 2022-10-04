const express = require('express')

const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const userController = require('../controllers/userController')

router.patch(
    '/update-me',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('free-user', 'subscribed-user', 'admin-user'),
    userController.updateMe,
)

router.delete(
    '/delete-me',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('free-user', 'subscribed-user', 'admin-user'),
    userController.deleteMe,
)

router.get(
    '/me',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('free-user', 'subscribed-user', 'admin-user'),
    userController.getMe,
)

router
    .route('/')
    .get(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('admin-user'),
        userController.getUsers,
    )
    .post(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('admin-user'),
        userController.createUser,
    )

router
    .route('/:id')
    .delete(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('admin-user'),
        userController.deleteUser,
    )
    .get(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('admin-user'),
        userController.getUser,
    )
    .patch(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('admin-user'),
        userController.updateUser,
    )

module.exports = router
