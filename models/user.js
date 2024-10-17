const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    ingrediace :{
        type: String,
        required: true,
    },
    notes: String,
 
   instructions: {
        type: String,
        required: true,
    },
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
    recipes: [ recipeSchema ]
});
const User = mongoose.model("User", userSchema);

module.exports = User;