const express = require("express");
const router = express.Router();
// import any models here
const User = require("../models/user.js");

// Index
router.get("/", async (req, res) => {
  
  const user = await User.findById(req.session.user._id);
  const recipes = user.recipes;
  if (req.session.user) {
    res.render("recipes/index.ejs", {  recipes });
  } else {
    res.render("index.ejs");
  }
});

// New
router.get("/new", (req, res) => {
  res.render("recipes/new.ejs");
});

router.put("/:recipeId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const recipe = currentUser.recipes.id(req.params.recipeId);
    // call set on subdocument to update it
    recipe.set(req.body);

    await currentUser.save();
    res.redirect(
      `/users/${req.session.user._id}/recipes/${req.params.recipeId}`
    );
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Delete

router.delete("/:recipeId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    // find and delete application by application id
    currentUser.recipes.id(req.params.recipeId).deleteOne();
    // save updated user w/ deleted application to db
    await currentUser.save();

    res.redirect(`/users/${req.session.user._id}/recipes`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.post("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    //req.body == all the user form data
    currentUser.recipes.push(req.body);
    // save updated user w/ new application to db

    await currentUser.save();
    res.redirect(`/users/${req.session.user._id}/recipes`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
// Edit
router.get("/:recipeId/edit", async (req, res) => {
  const currentUser = await User.findById(req.session.user._id);
  const recipe = currentUser.recipes.id(req.params.recipeId);
  res.render("recipes/edit.ejs", { recipe });
});

//SHOW
router.get("/:recipeId", async (req, res) => {
  const currentUser = await User.findById(req.session.user._id);
  // .id is a mongoose method to find a subdocument by its id
  const recipe = currentUser.recipes.id(req.params.recipeId);

  res.render("recipes/show.ejs", { recipe });
});
module.exports = router;
