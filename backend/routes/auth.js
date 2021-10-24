const express = require('express')
var router = express.Router()
const urlEncodedParser = express.urlencoded({ extended: true })
const bcrypt = require('bcryptjs')
const User = require("../models/User")
const jwt = require("../auth/jwt")

router.use((req,res,next)=>{
  next()
})

router.post("/register", urlEncodedParser, async (req, res) => {
  console.log("POST /register");
  var requiredFields = ["username", "password", "email"]
  for (const [key, value] of Object.entries(req.body)) {
    requiredFields.includes(key) && value ?
      requiredFields = requiredFields.filter(field => field !== key)
      : ""
  }
  if (requiredFields.length !== 0) {
    return res.status(400).json(
      requiredFields.map(el => {
        return { [el]: "This field is required" }
      })
    )
  }

  if(!(req.body.email).match(new RegExp(/^[A-Za-z0-9]*@[A-Za-z0-9]*\.[A-Za-z0-9]+$/))){
    return res.status(400).json({email: "Email format invalid ( expected: example@mail.com )"})
  }

  if (await User.findOne({ username: req.body.username }) !== null) {
    //there is already a user with this username
    return res.status(400).json({ username: "Username already taken" })
  }

  if (await User.findOne({ email: req.body.email }) !== null) {
    //there is already a user with this email
    return res.status(400).json({ email: "Email already taken" })
  }

  //user not found - create a new one
  var user = User(req.body)
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  const resp = await user.save()
  res.status(201).json(resp)
});

router.post("/login", urlEncodedParser, async (req, res) => {
  console.log("POST /api/login");
  if (!req.body.username) {
    if (!req.body.password) {
      return res.status(400).json([
        { username: "This field is required" },
        { password: "This field is required" }
      ])
    }
    return res.status(400).json({ username: "This field is required" })
  } else if (!req.body.password) {
    return res.status(400).json({ password: "This field is required" })
  }
  const user = await User.findOne({ username: req.body.username }).exec()
  if (user) {
    const is_pass_valid = await bcrypt.compare(req.body.password, user.password)
    if (is_pass_valid) {
      return res.status(200).json(await jwt.generateTokens(user))
    } else return res.status(400).json({ password: "Password is invalid" });
  } else return res.status(404).json({ username: "User not found" });
});

router.post('/logout', jwt.logout, (req, res) => {
  return res.status(200).json({message: "Success"})
})

router.post("/token/refresh", jwt.refreshToken, (req, res) => {
  return res.status(200).json({access: req.access})
})

module.exports = router
