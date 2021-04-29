const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find()
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNew = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createNewCamp = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground)
    newCampground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    newCampground.author = req.user._id
    await newCampground.save()
    req.flash('success', 'Successfully make a new campground!')
    res.redirect('/campgrounds')
}

module.exports.showCamp = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews', populate: {
            path: 'author'
        }}).populate('author')
    if (!campground) {
        req.flash('error', 'Campground does not exist!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground does not exist!')
        return res.redirect('/campgrounds')
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!')
        return res.redirect(`/campgrounds/${id}`)
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCamp = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
    const images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...images)
    await campground.save()
    req.flash('success', 'Successfully update a campground!')
    res.redirect('/campgrounds')
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully delete a campground!')
    res.redirect('/campgrounds')
}