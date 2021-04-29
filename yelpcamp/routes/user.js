const mongoose = require('mongoose')
const express = require('express')
const User = require('../models/user')
const router = express.Router()
const userController = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')

router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.registerUser))

router.route('/login')
    .get(userController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login)

router.get('/logout', userController.logout)

module.exports = router