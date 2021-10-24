const jwt = require("../auth/jwt")

const { getAndPaginateResults } = require("../helpers")

module.exports = (app) => {
  app.get("/api/protected", jwt.authenticateToken, async (req, res) => {
    return res.status(200).json({ authenticated: "True", user: req.user })
  })


  // this will return only the first page of shows' results .. i found out there are 
  // around 50000 shows.. so this is not the best solution.
  app.get("/api/shows", getAndPaginateResults('http://api.tvmaze.com/shows'), (req, res) => {
    res.send(res.paginatedResults)
  })

}