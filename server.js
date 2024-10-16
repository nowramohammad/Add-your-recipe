const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");
const recipeController = require("./controllers/recipes.js");
const path = require("path");

const authController = require("./controllers/auth.js");

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: false}));
app.use(methodOverride("_method"));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        maxAge: 10000,
    })
);
app.use(passUserToView);

app.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect(`/users/${req.session.user._id}/recipes`);
        return;
    }
    res.render("index.ejs", {
        user: req.session.user,
    })
});
app.get('/recipes/:id', async (req, res) => {
  try {
      const recipe = await getRecipeById(req.params.id); // Fetch recipe asynchronously
      res.render('recipes/show', { recipe }, { async: true });
  } catch (error) {
      res.status(500).send('Error occurred');
  }
});

/*app.get('/users/:id/recipes', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const recipes = await Recipe.find({ userId: user._id }); // Assuming there's a relation
  
      res.render('your_template', { user, recipes }); // Pass both user and recipes
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });*/

app.use("/auth", authController);
app.use(isSignedIn);
app.use("/users/:userId/recipes", recipeController);



app.use(express.urlencoded({ extended: true })); // For URL-encoded data
app.use(express.json());




app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });