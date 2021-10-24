const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: { type: String, required: true, dropDups: true, unique : true },
  password: { type: String, required: true },
  email: { type: String, required: true, dropDups: true, unique : true },
  first_name: { type: String, default: ""},
  last_name: { type: String, default: ""},
  created_at: { type: Date, default: Date.now },
  fav_shows: { type: Array, default: [], required: false}
});

module.exports = UserSchema
