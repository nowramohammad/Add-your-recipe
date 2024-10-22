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

//let comments = [];


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



app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.post('/users/:userId/recipes', (req, res) => {
  const { title, ingredients, instructions, image } = req.body;

  if (!image) {
      return res.status(400).json({ message: 'Image is required' });
  }

  const newRecipe = { title, ingredients, instructions, image };

  User.findByIdAndUpdate(req.params.userId, { $push: { recipes: newRecipe } }, { new: true })
      .then(user => {
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
          res.status(201).json(user);
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Error saving recipe', error: err });
      });
});

/*app.post('/recipe/:id/comments', (req, res) => {
  const newComment = {
      text: req.body.comment,
      author: 'User' // You can customize this to get the actual user's name
  };
  comments.push(newComment); // Add the comment to the comments array
  res.redirect(`/recipe/${req.params.id}`); // Redirect back to the recipe page
});
*/


app.delete("/recipes/:id", (req, res) => {
 
  Recipe.findByIdAndDelete(req.params.id).then((responseFromDb) => {
    console.log(responseFromDb);
    res.redirect("/recipes");
  });
});
app.use('images', express.static(path.join(__dirname, 'public/images')));


app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });