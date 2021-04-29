const express = require('express')
const router = express.Router()
const campController = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground, checkAuthor } = require('../utils/middlewares.js')
const { storage } = require('../cloudinary')
const multer = require('multer')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campController.createNewCamp))

router.get('/new', isLoggedIn, campController.renderNew)

router.route('/:id')
    .get(catchAsync(campController.showCamp))
    .patch(isLoggedIn, checkAuthor, upload.array('image'), validateCampground, catchAsync(campController.updateCamp))
    .delete(isLoggedIn, checkAuthor, catchAsync(campController.deleteCamp))

router.get('/:id/edit', isLoggedIn, catchAsync(campController.renderEdit))

module.exports = router