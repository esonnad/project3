const express = require('express');
const User = require('../models/User')
const { isLoggedIn } = require('../middlewares')
const router = express.Router();

router.get('/', (req,res,next)=>{
  res.json(req.user);
})

module.exports = router;