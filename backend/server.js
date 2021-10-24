var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connection to DB Successfull"))
  .catch((err) => console.error(err))

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

var users = require('./routes/users')
var auth = require('./routes/auth')
var shows = require('./routes/shows')
var favourites = require('./routes/favourites')

app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/shows', shows)
app.use('/api/favourites', favourites)

//API
/* require("./routes/login")(app);
require("./routes/user")(app);
require("./routes/dashboard")(app);
require("./routes/products")(app);
require("./routes/message")(app); */

/* // Accessing the path module
const path = require("path");

//Stuff from tutorials to try to connect to heroku
// Step 1:

app.use(express.static(path.resolve(__dirname, "./frontend/build")));
// Step 2:
app.get("*", function (request, response) {
  console.log("SERVER REQUEST FROM FRONTEND *");
  response.sendFile(path.resolve(__dirname, "./frontend/build", "index.html"));
});
 */


