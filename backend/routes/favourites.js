var express = require('express')
const { authenticateToken } = require('../auth/jwt')
const User = require('../models/User')
var router = express.Router()
const axios = require('axios')
const Show = require('../models/Show')
const { paginateFavs } = require('../helpers')


router.post('/:username', authenticateToken, async (req, res) => {
  console.log("add show to user favs")
  if (req.user.username == req.params.username) {
  var user = await User.findById(req.user.id)
  const show = new Show({
    show_id: req.body.show_id,
    rating: 0,
    note: ""
  })
  user.fav_shows.push(show)
  const result = await user.save()
  res.status(201).json(result)
  }else {
    res.status(403).json({ message: 'Unauthorized access' })
  }
})

router.delete('/:username', authenticateToken, async (req, res) => {
  console.log("remove show from user favs")
  if (req.user.username == req.params.username) {
  var user = await User.findById(req.user.id)
  if (user.fav_shows.filter(show=>show.show_id === req.body['show_id']).length !== 0) {
    user.fav_shows = user.fav_shows.filter(show=>show.show_id != req.body['show_id'])
    const result = await user.save()
    return res.status(200).json(result)
  }
  return res.status(404).json({ message: "Show not in user favourites list" })
  }else {
    res.status(403).json({ message: 'Unauthorized access' })
  }
})

router.get('/:username', authenticateToken,  async (req, res) => {
  console.log("get user favs")
  if (req.user.username == req.params.username) {
    var user = await User.findById(req.user.id)
    // multiple fetching .. this is useful
    var shows = []
    var promises = []
    user.fav_shows.map(async (show)=>{
      promises.push(axios.get(`https://api.tvmaze.com/shows/${show.show_id}`).then(resp=>{
        shows.push(resp.data)
      }))
    })
    Promise.all(promises).then(() => res.status(200).json(shows))
  } else {
    res.status(403).json({ message: 'Unauthorized access' })
  }
})

router.post('/:username/:key', authenticateToken, async (req, res) => {
  if (req.user.username == req.params.username) {
    var user = await User.findById(req.user.id)
    var show = user.fav_shows.filter((s)=>s.show_id === req.body.show_id)[0]
    if(show){
      if(req.params.key === 'rate'){
        show.rating = req.body.rating
      }else if(req.params.key === 'note'){
        show.note = req.body.note
      }
      const resp = await user.save()
       return res.status(201).json(resp)
    }
    // show not in favs
    if(req.params.key === 'rate') return res.status(400).json({message: "Can't rate. Reason: show not in favourites"})
    return res.status(400).json({message: "Can't save not. Reason: show not in favourites"})
  }else{
    res.status(403).json({ message: 'Unauthorized access' })
  }
})

router.get('/:username/paginate', [authenticateToken, paginateFavs], async (req, res)=>{
  console.log('paginate favs')
  res.status(200).send(res.paginatedResults)
})

module.exports = router