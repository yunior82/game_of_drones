const mongoose = require("mongoose");

var Players = mongoose.model('Players', {
  player_1: { type: String },
  player_2: { type: String }
});

var Score = mongoose.model('Score', {
  round: { type: String },
  winner: { type: String }
});

module.exports = { Players, Score };
