const express = require('express');
const Post = require('../models/Post')
const User = require('../models/User')
const { isLoggedIn } = require('../middlewares')
const router = express.Router();
const parser = require('../configs/cloudinary.js');
const cloudinary = require('cloudinary');

router.get('/', (req, res, next) => {
  Promise.all([Post.find({privacy: "Public"}).populate('_owner', 'username'), Post.find({privacy: "Anonymous"}).populate('_owner', 'username')])
   // Populate on the field 'username' and '_id' (default) ==> avoid displaying the hash password that could be a security issue
    .then(([postsPublic, postsAnonymous]) => {
      postsAnonymous.forEach(post => {post._owner._id = "5c0905e280892708c581af43"; post._owner.username= "Anonymous"})
      console.log("anonymous", postsAnonymous)
      res.json({
        public: postsPublic,
        anonymous: postsAnonymous
      });
    })
    .catch(err => next(err))
});

router.post('/', isLoggedIn, parser.single('picture'), (req, res, next) => {
  console.log("POST FUNCTION- WITH PICTURE", req.body)
  console.log("POST FUNCTION REQUEST: REQ.file", req.file)

  let { title, text, tagged, lng, lat, category, privacy, public_id } = req.body
  let file = req.file
  let _owner = req.user._id
  if (!title || !text || !lng || !lat || !category ) {
    next(new Error('You have to send: title, description, lng, lat, category, picture'))
  }
  if(tagged !== "") {
    User.find({username: tagged})
    .then(user => {
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
        _tagged: user[0]._id,
        _owner
      })
        .then(post => {
          res.json({
            success: true,
            post
          });
        })
        .catch(err => next(err))
    })
    .catch(err => console.log(err))
  }else {
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
      .catch(err => next(err))
  }
  
  }
//}
);

router.post('/nopicture', isLoggedIn, (req, res, next) => {
  console.log("POST FUNCTION NO PICTURE: REQ.BODY", req.body)

  let { title, text, tagged, lng, lat, category, privacy} = req.body
  let _owner = req.user._id
  if (!title || !text || !lng || !lat || !category ) {
    next(new Error('You have to send: title, description, lng, lat, category, picture'))
  }
  if(tagged !== ""){
    User.find({username: tagged})
      .then(user => {
        Post.create({
          title: title,
          text : text,
          category: category,
          privacy: privacy,
          picture: "",
          location: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          _tagged: user._id,
          _owner
        })
          .then(post => {
            res.json({
              success: true,
              post
            });
          })
          .catch(err => next(err))
      })
  } else {
    Post.create({
      title: title,
      text : text,
      category: category,
      privacy: privacy,
      picture: "",
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
    }
})

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
  .populate('_tagged', 'username')
    .then(post => {
      res.json(post);
    })
    .catch(err => next(err))
})



router.post('/:postid', parser.single('picture'), (req,res,next)=>{
  let id = req.params.postid
  //cloudinary.v2.uploader.destroy(req.user.public_id, function(result) { console.log(result) });
  let { title, tagged, text, lng, lat, category, privacy, public_id } = req.body
  let file = req.file;
  let _tagged = "";
  if (!title || !text || !lng || !lat || !category ) {
    next(new Error('You have to send: title, description, lng, lat, category, picture'))
  }
  if(tagged !== ""){
    User.find({username: tagged})
      .then(user => {_tagged = user._id})
      .catch(err => console.log(err))
  }
  Post.findByIdAndUpdate(id, {
    title: title,
    text : text,
    category: category,
    privacy: privacy,
    picture: file.url, 
    public_id: file.public_id,
    location: {
      type: 'Point',
      coordinates: [lng, lat]
    },
    _tagged: _tagged,
  })
    .then(update => {
      res.json({
        success: true,
        imageURL: file.url
      })
    })
    .catch(err => next(err))
})

router.post('/nopicture/:postid', isLoggedIn, (req, res, next) => {
  let id = req.params.postid
  let { title, tagged, text, lng, lat, category, privacy} = req.body
  let _tagged = "";
  if (!title || !text || !lng || !lat || !category ) {
    next(new Error('You have to send: title, description, lng, lat, category, picture'))
  }
  if(tagged !== ""){
    User.find({username: tagged})
      .then(user => {_tagged = user._id})
      .catch(err => console.log(err))
  }
  Post.findByIdAndUpdate(id, {
    title: title,
    text : text,
    category: category,
    privacy: privacy,
    location: {
      type: 'Point',
      coordinates: [lng, lat]
    },
    _tagged: _tagged,
  })
    .then(update => {
      res.json({
        success: true,
      })
    })
    .catch(err => next(err))
  
    })

module.exports = router;
