const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpTokenSchema = Schema({
  username: { type: String},
  token: { type: String, required: true }
});

module.exports = ExpTokenSchema;
