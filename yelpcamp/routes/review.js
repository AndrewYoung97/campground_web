const express = require('express')
const router = express.Router({ mergeParams: true })
const reviewController = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync')
const { validateReview, isLoggedIn } = require('../utils/middlewares')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview))

router.delete('/:reviewId', isLoggedIn, catchAsync(reviewController.deleteReview))

module.exports = router