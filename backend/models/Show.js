const mongoose = require("mongoose");
const ShowSchema = require("../schemas/ShowSchema");

//define the product model
module.exports = mongoose.model("Show", ShowSchema, "shows");
