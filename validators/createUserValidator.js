exports.createUserValidator = (req, res, next) => {
    req.check('fullName', 'Please provide a full name').notEmpty()
    req.check('email', 'Email is required').notEmpty()
    req.check('email', 'Please provide a valid email').isEmail()
    req.check('password', 'Please provide a password').notEmpty()
    req.check('password', 'Password should be at least 6 characters').isLength({ min: 6 })
    req.check('passwordConfirm', 'Please confirm your password').notEmpty()
    req.checkBody('password', 'Passwords do not match').equals(req.body.passwordConfirm)

    const errors = req.validationErrors()

    if (errors) {
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({ error: firstError })
    }

    next()
}
