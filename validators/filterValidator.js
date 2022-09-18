exports.filterValidator = (req, res, next) => {
    req.check('url', 'Url is required').notEmpty()
    req.check('type', 'Type is required').notEmpty()
    req.check('description', 'Description is required').notEmpty()

    const errors = req.validationErrors()

    if (errors) {
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({ error: firstError })
    }

    next()
}
