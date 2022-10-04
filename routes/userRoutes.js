const express = require('express')

const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const userController = require('../controllers/userController')

// AUTH ROUTES
router.use(
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('user', 'subscriber', 'administrator'),
)
router.patch('/updateMe', userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)
router.get('/me', userController.getMe)

router.use(authMiddleware.restrictTo('administrator'))

// ADMINISTRATORS ONLY
router.route('/').get(userController.getUsers).post(userController.createUser)
router
    .route('/:id')
    .delete(userController.deleteUser)
    .get(userController.getUser)
    .patch(userController.updateUser)

module.exports = router
