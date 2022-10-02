exports.getWeekly = (req, res, next) => {
    req.query.type = 'weekly'
    next()
}

exports.getYearly = (req, res, next) => {
    req.query.type = 'yearly'
    next()
}
