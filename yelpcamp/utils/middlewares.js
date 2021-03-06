const ExpressError = require('./ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema, reviewSchema } = require('../schemas.js')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(err => err.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

module.exports.checkAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(err => err.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}