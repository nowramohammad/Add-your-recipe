const mongoose = require('mongoose');

const recipes = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    ingrediace :{
        type: String,
        required: true,
    },
    notes: String,
  postingLink: String,
    stepstomake: {
        type: String,
        required: true,
    }
});

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
});
const User = mongoose.model("User", userSchema);

module.exports = User;