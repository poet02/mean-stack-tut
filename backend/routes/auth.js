const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken')
const router = express.Router();

router.post("/register", (req, res, next) => {
  console.log('in route', req.body)
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user.save().then((result) => {
        res.status(201).json({
          res: result,
          message: "User added successfully",
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", (req, res, next) => {
  console.log(req.body)
  User.findOne({email: req.body.email}).then(user => {
      if(!user) {
        return res.status(401).json({
          message: "login failed1",
        });
      }

     return bcrypt.compare(req.body.password, user.password)
      .then(result => {
        if(!result) {
          return res.status(401).json({
            message: "login failed2",
          });
        }
        //create json web token
        const token = jwt.sign({email: user.email, userId: user._id}, 'this_should be longer-string',
          {expiresIn: '1h'}
          );
          res.status(200).json({
            token: token,
            message: "login success",
          });
      })
      .catch(err => {
        console.log(err)
        return res.status(401).json({
          message: "login failed3",
          error: err
        });
      })

    })
})

module.exports = router;
