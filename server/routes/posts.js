const express = require('express');
const Post = require('../models/Post')
const { isLoggedIn } = require('../middlewares')
const router = express.Router();
const parser = require('../configs/cloudinary.js');
const cloudinary = require('cloudinary');

router.get('/', (req, res, next) => {
  Promise.all([Post.find({privacy: "Public"}).populate('_owner', 'username'), Post.find({privacy: "Anonymous"})])
   // Populate on the field 'username' and '_id' (default) ==> avoid displaying the hash password that could be a security issue
    .then(([postsPublic, postsAnonymous]) => {
      res.json({
        public: postsPublic,
        anonymous: postsAnonymous
      });
    })
    .catch(err => next(err))
});

router.post('/', isLoggedIn, parser.single('picture'), (req, res, next) => {
  console.log("POST FUNCTION REQUEST: REQ.BODY", req.body)
  console.log("POST FUNCTION REQUEST: REQ.file", req.file)

  let { title, text, lng, lat, category, privacy, public_id } = req.body
  let file = req.file
  let _owner = req.user._id
  if (!title || !text || !lng || !lat || !category ) {
    next(new Error('You have to send: title, description, lng, lat, category, picture'))
  }
  if(file === null) {
    Post.create({
      title: title,
      text : text,
      category: category,
      privacy: privacy,
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
  } else {
  Post.create({
    title: title,
    picture: file.url,
    public_id: public_id,
    text : text,
    category: category,
    privacy: privacy,
    public_id: file.public_id,
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
    .catch(err => next(err))}
});

router.post('/picture', parser.single('picture'), (req,res,next)=>{
  console.log("Post Picture Request:", req.file)
  if(req.file.public_id || req.file.public_id !== ""){cloudinary.v2.uploader.destroy(req.file.public_id, function(result) { console.log("WHAT IS THIS? WHAT DOES THIS FUNCTION DO? WHO AM I?? ") });}
  res.json({
    imageURL: req.file.url,
    public_id: req.file.public_id
  })
})

router.get('/myposts', (req,res,next)=>{
  let id = req.user._id
  Post.find({_owner:id})
  .populate('_owner', 'username')
    .then(posts => {
      res.json(posts);
    })
    .catch(err => next(err))
})

router.get('/:postid', (req,res,next)=>{
  let id = req.params.postid
  Post.findById(id)
  .populate('_owner', 'username')
    .then(post => {
      res.json(post);
    })
    .catch(err => next(err))
})



router.post('/:postid', parser.single('picture'), (req,res,next)=>{
  let id = req.params.postid
  cloudinary.v2.uploader.destroy(req.user.public_id, function(result) { console.log(result) });
  let { title, text, lng, lat, category } = req.body
  if (!title || !text || !lng || !lat || !category || !picture) {
    next(new Error('You have to send: title, description, lng, lat, category, picture'))
  }
  Post.findByIdAndUpdate(id, {
    title: title,
    picture: picture,
    text : text,
    category: category,
    picture: req.file.url, 
    public_id: req.file.public_id,
    location: {
      type: 'Point',
      coordinates: [lng, lat]
    },
  })
    .then(update => {
      res.json({
        success: true,
        imageURL: req.file.url
      })
    })
    .catch(err => next(err))
})

module.exports = router;
