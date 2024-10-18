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
    notes: {
        type: String,
        required: true
    },
 
   instructions: {
        type: String,
        required: true,
    },
   image:{
    type: String,
    required: true,
   }
});
/*
const userSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    username: string;
    password: string;
    recipes: mongoose.Types.DocumentArray<{
        title: string;
        ingrediace: string;
        instructions: string;
        notes?: unknown;
    }>;
}, mongoose.Document<...> & ... 2 more ... & {
    ...;
}>
*/




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