const mongoose = require("mongoose");
const ExpTokenSchema = require("../schemas/ExpTokenSchema");

//define the product model
module.exports = mongoose.model("ExpToken", ExpTokenSchema, "exptokens");
