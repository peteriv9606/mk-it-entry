const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShowSchema = Schema({
  show_id: { type: Number, required: true,  },
  rating: { type: Number, required: false },
  note: { type: String, required: false}
});

module.exports = ShowSchema