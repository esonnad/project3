const express = require('express');
const User = require('../models/User')
const { isLoggedIn } = require('../middlewares')
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const parser = require('../configs/cloudinary.js');
const cloudinary = require('cloudinary');

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

router.get('/', (req,res,next)=>{
  console.log("there is a user:", req.user)
  res.json(req.user);
})

router.post('/', (req,res,next)=>{
  const { username, email } = req.body
  let id = req.user._id
  if(email !== req.user.email){
    User.findByIdAndUpdate(id, {username: username, email:email, emailStatus: "UNVERIFIED"})
      .then(updatedUser => {
        var mailOptions = {
          to: email,
          from: '"Pin Point"',
          subject: 'Your New Email',
          text: `Your changed your email!\n\n` +
            'On your pin point account\n\n' +
            `Please click here: https://ironpinpoint.herokuapp.com/verifyemail/${updatedUser._id}\n` + 
            `to verify your account. Otherwise you won\'t be able to reset it, in case you forgot.\n`
        };
        transporter.sendMail(mailOptions)
        updatedUser.password = undefined;
        res.json( updatedUser );
      })
  } else {
    User.findByIdAndUpdate(id, {username: username})
      .then(updatedUser =>{
        updatedUser.password = undefined;
        res.json( updatedUser );
      })
  }
})

router.post('/changepassword', (req,res,next)=>{
  let id = req.user._id;
  const {oldPassword, newPassword, confirmNewPassword} = req.body
  if (!bcrypt.compareSync(oldPassword, req.user.password)) {
    res.status(401).json({ message: "The old password is not correct!" })
    return;
  }
  if(newPassword !== confirmNewPassword) {
    res.status(401).json({ message: "The new passwords are not the same!" })
    return;
  } else {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(newPassword, salt);
    User.findByIdAndUpdate(id, {password: hashPass})
      .then(updatedUser => {
        updatedUser.password = undefined;
        res.json( updatedUser );
      })
      .catch(err => console.log(err))
  }
})

router.get('/verify/:id', (req,res,next)=>{
  let id = req.params.id
  User.findByIdAndUpdate(id, {emailStatus: "VERIFIED"})
  .then(verifiedUser => {
    verifiedUser.password = undefined;
    res.json(verifiedUser);
  })
})

router.get('/:id', (req,res,next)=>{
  let id = req.params.id
  User.findById(id)
  .then(user => {
    res.json(user);
  })
})

router.post('/picture', parser.single('picture'), (req,res,next)=>{
  console.log("User post picture route. Request File:", req.file)
  let id = req.user._id;
  cloudinary.v2.uploader.destroy(req.user.public_id, function(result) { console.log(result) });
  User.findByIdAndUpdate(id, { imageURL: req.file.url, public_id: req.file.public_id })
  .then(() => {
    res.json({
      success: true,
      imageURL: req.file.url
    })
  })
})

module.exports = router;