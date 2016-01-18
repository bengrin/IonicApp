var mongoose = require('mongoose');

var WhichSchema = new mongoose.Schema({
  // _id:    mongo creates this
  question: {type: String, default: ''},
  createdBy: {type: String, default: 'Anonymous'}, // username
  votesFrom: Array,  // array of userID strings
  tags: Array,
  type : {type: String, default: 'text'},
  thingA : {type: String, default: ''}, // either string of text, or url to resource
  thingB : {type: String, default: ''},
  thingAVoteCount : {type: Number, default: 0},
  thingBVoteCount : {type: Number, default: 0},
  createdAt : { type: Date, default: Date.now },
  friendsOnly: Boolean
});

module.exports = mongoose.model('Which', WhichSchema);
