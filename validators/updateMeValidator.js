exports.updateMeValidator = (req, res, next) => {
    req.check('fullName', 'Please provide a full name').notEmpty()
    req.check('email', 'Email is required').notEmpty()
    req.check('email', 'Please provide a valid email').isEmail()

    const errors = req.validationErrors()

    if (errors) {
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({ error: firstError })
    }

    next()
}
