var axios = require('axios')
const url = require('url')

module.exports = {
  getAndPaginateResults: function (url_input) {
    // Original idea: https://betterprogramming.pub/build-a-paginated-api-using-node-js-express-and-mongodb-227ed5dc2b4b
    // My rework (to work with external apis with no pagination (just bulk results))
    return async (req, res, next) => {
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

      const response = await axios.get(url_input).then(data => data).catch(err => err)     

      try {
        data.current_page = page
        data.pages = Math.ceil(response.data.length / 12)
        data.count = response.data.length
        data.results = response.data.slice(startIndex, endIndex)
        res.paginatedResults = data;
        next();
      } catch (e) {
        res.status(500).json({ message: "Error occured while trying to fetch the data" });
      }
    }
  }
}