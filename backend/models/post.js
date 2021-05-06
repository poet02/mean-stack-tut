const mongoose = require('mongoose')

///we gna create a schema

//blueprint
const postSchema = mongoose.Schema({
  // Notice types are capital
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String},
  // title: String,
  // content: String,
});

module.exports = mongoose.model('Post', postSchema)
