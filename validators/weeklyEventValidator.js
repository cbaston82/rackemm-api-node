exports.weeklyEventValidator = (req, res, next) => {
    req.check('description', 'Description is required').notEmpty()
    req.check('title', 'Title is required').notEmpty()
    req.check('pointOfContact', 'Point of contact is required').notEmpty()
    req.check('pointOfContactPhone', 'Point of contact phone is required').notEmpty()
    req.check('buyIn', 'Buy-in is required').notEmpty()
    req.check('day', 'Day is required').notEmpty()
    req.check('venue', 'Venue is required').notEmpty()
    req.check('address', 'Address is required').notEmpty()
    req.check('startTime', 'Start time is required').notEmpty()
    req.check('city', 'City is required').notEmpty()
    req.check('ratingSystem', 'Rating system is required').notEmpty()
    req.check('game', 'Game is required').notEmpty()
    req.check('state', 'State is required').notEmpty()
    req.check('zipCode', 'Zipcode is required').notEmpty()
    req.check('status', 'Status is required').notEmpty()

    const errors = req.validationErrors()

    if (errors) {
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({ error: firstError })
    }

    next()
}
