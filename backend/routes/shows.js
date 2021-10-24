var express = require('express')
var router = express.Router()
const axios = require("axios")

router.get("/", async (req, res) => {
  return await axios.get(`https://api.tvmaze.com/shows?page=${req.query.page || 0}`)
  .then(response=>res.status(200).json(response.data))
  .catch(error=>res.status(500).send(error))
})

router.get("/:slug", async (req, res) => {
  var look_for = (req.params.slug).replace(new RegExp('-', 'g'), '%20')
  return await axios.get(`https://api.tvmaze.com/singlesearch/shows?q=${look_for}`)
  .then(response=>res.status(200).json(response.data))
  .catch(error=>res.status(500).send(error))
})

router.get('/search/:query', async (req, res) => {
  return await axios.get(`https://api.tvmaze.com/search/shows?q=${req.params.query}`)
  .then(response=>res.status(200).json(response.data))
  .catch(error=>res.status(500).send(error))
})

module.exports = router