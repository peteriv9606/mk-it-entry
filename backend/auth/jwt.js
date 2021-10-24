const jwt = require('jsonwebtoken');
const ExpToken = require('../models/ExpToken');

module.exports = {
  generateTokens: function (user) {
    const access = jwt.sign({id: user._id, username: user.username}, process.env.TOKEN_SECRET, { expiresIn: '600s' })
    const refresh = jwt.sign({id: user._id, username: user.username}, process.env.TOKEN_SECRET, { expiresIn: '21600s' }) 

    return {access, refresh}
  },
  authenticateToken: async function (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({message: "Authentication credentials were not provided"})
    
    // check if blacklisted
    if (await ExpToken.findOne({ token: token }) !== null) {
      // token is blacklisted
      return res.status(403).json({message: "Invalid token provided"})
    }
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {  
      if (err) {
        try {
          var decoded = jwt.decode(token)
          resp = await ExpToken({username: decoded?.username, token: token}).save()          
        } catch (error) {}
        return res.status(403).json({message: "Invalid token provided"})
      }
      req.user = user
      next()
    })
  },
  refreshToken: async function (req, res, next) {
    const refresh_token = req.body.refresh

    if (refresh_token == null || refresh_token == undefined) return res.status(401).json({message: "Authentication credentials were not provided"})
    
    if (await ExpToken.findOne({ token: refresh_token }) !== null) {
      // token is blacklisted
      return res.status(403).json({message: "Invalid token provided"})
    }

    jwt.verify(refresh_token, process.env.TOKEN_SECRET, async (err, user) => {  
      var decoded = jwt.decode(refresh_token)
      if (err) return res.status(403).json({message: "Invalid token provided"})
      // Issue new access token if refresh token is valid

      req.access = jwt.sign({id: decoded.id, username: decoded.username}, process.env.TOKEN_SECRET, { expiresIn: '600s' })
     
      next()
    })
  },
  logout: async function(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({message: "Authentication credentials were not provided"})
    if (await ExpToken.findOne({ token: token }) !== null) {
      // token is already blacklisted
      return res.status(200).json({message: "Success"})
    }else{
      // blacklist token
      var decoded = jwt.decode(token)
      await ExpToken({username: decoded?.username, token: token}).save()
      next()
    }
  }

}