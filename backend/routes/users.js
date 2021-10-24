var express = require('express')
var router = express.Router()
const jwt = require("../auth/jwt")
const User = require("../models/User")

router.get("/:username", jwt.authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id)
  return res.status(200).json(user)
})

module.exports = router