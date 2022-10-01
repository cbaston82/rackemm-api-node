const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.requireSignin = async (req, res, next) => {
    try {
        const { authorization } = req.headers

        if (!authorization) {
            return res.status(401).json({ error: 'Authorization failed' })
        }

        const token = authorization.split(' ')[1]

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded._id)

        if (!user) {
            return res.status(401).json({ error: 'Authorization failed' })
        }

        if (user.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({ error: 'Authorization failed' })
        }

        req.user = user

        next()
    } catch (error) {
        res.status(401).json({ error: 'Authorization failed' })
    }
}

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        console.log(roles)
        console.log(req.user)
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have permission' })
        }

        next()
    }
