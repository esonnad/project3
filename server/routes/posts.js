const express = require('express');
const Post = require('../models/Post')
const { isLoggedIn } = require('../middlewares')

const router = express.Router();

router.get('/', (req, res, next) => {
  Post.find()
  .populate('_owner', 'username') // Populate on the field 'username' and '_id' (default) ==> avoid displaying the hash password that could be a security issue
    .then(posts => {
      res.json(posts);
    })
    .catch(err => next(err))
});

router.post('/', isLoggedIn, (req, res, next) => {
  let { title, text, lng, lat } = req.body
  let _owner = req.user._id
  if (!title || !text || !lng || !lat) {
    next(new Error('You have to send: title, description, pricePerNight, lng, lat'))
  }
  Post.create({
    title,
    text,
    location: {
      type: 'Point',
      coordinates: [lng, lat]
    },
    _owner
  })
    .then(post => {
      res.json({
        success: true,
        post
      });
    })
    .catch(err => next(err))
});

module.exports = router;
