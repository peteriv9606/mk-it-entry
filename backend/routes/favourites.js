var express = require('express')
const { authenticateToken } = require('../auth/jwt')
const User = require('../models/User')
var router = express.Router()
const axios = require('axios')


router.post('/', authenticateToken, async (req, res) => {
  console.log("add show to user favs")
  if (req.user.username == req.params.username) {
  var user = await User.findById(req.body['user_id'])
  user.fav_shows.push(req.body.show_id)
  const result = await user.save()
  res.status(201).json(result)
  }else {
    res.status(403).json({ message: 'Unauthorized access' })
  }
})

router.delete('/', authenticateToken, async (req, res) => {
  console.log("remove show from user favs")
  if (req.user.username == req.params.username) {
  var user = await User.findById(req.body['user_id'])
  if (user.fav_shows.includes(req.body['show_id'])) {
    user.fav_shows = user.fav_shows.filter(id => id != req.body['show_id'])
    const result = await user.save()
    return res.status(200).json(result)
  }
  return res.status(404).json({ message: "Show not in user favourites list" })
  }else {
    res.status(403).json({ message: 'Unauthorized access' })
  }
})

router.get('/:username', authenticateToken,  async (req, res) => {
  console.log(req.user)
  if (req.user.username == req.params.username) {
    var user = await User.findById(req.user.id)
    // multiple fetching .. this is useful
    var shows = []
    var promises = []
    user.fav_shows.map(async (id)=>{
      promises.push(axios.get(`https://api.tvmaze.com/shows/${id}`).then(resp=>{
        shows.push(resp.data)
      }))
    })
    Promise.all(promises).then(() => res.status(200).json(shows))
  } else {
    res.status(403).json({ message: 'Unauthorized access' })
  }
})

module.exports = router