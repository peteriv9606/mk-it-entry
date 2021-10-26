const { default: axios } = require("axios")
const User = require("./models/User")
const _ = require('lodash')
module.exports = {
  paginateFavs: async function (req, res, next) {
    // Original idea: https://betterprogramming.pub/build-a-paginated-api-using-node-js-express-and-mongodb-227ed5dc2b4b
    // My rework (to work with external apis with no pagination (just bulk results))

    const page = parseInt(req.query.page) || 1
    const range = 12
    const startIndex = (page - 1) * range
    const endIndex = startIndex + range

    var data = {
      current_page: null,
      pages: null,
      count: null,
      results: []
    }

    user = await User.findById(req.user.id)
    var shows = []
    var promises = []
    user.fav_shows.map(async (show) => {
      promises.push(axios.get(`https://api.tvmaze.com/shows/${show.show_id}`).then(resp => {
        shows.push(resp.data)
      }))
    })
    Promise.all(promises).then(() => {
      // sort by id
      var sorted = shows.sort((a,b)=>{
        return a.id - b.id
      })
      try {
        data.current_page = page
        data.pages = Math.ceil(sorted.length / 12)
        data.count = sorted.length
        data.results = sorted.slice(startIndex, endIndex)
        res.paginatedResults = data;
        next();
      } catch (e) {
        res.status(500).json({ message: "Error occured while trying to fetch the data" });
      }
    })

  }
}
