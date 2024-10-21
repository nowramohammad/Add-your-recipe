const express = require("express");
const router = express.Router();
// import any models here
const User = require("../models/user.js");









// index for the pages 
router.get("/", async (req, res) => {
  
  const user = await User.findById(req.session.user._id);
  const recipes = user.recipes;
  if (req.session.user) {
    res.render("recipes/index.ejs", {  recipes });
  } else {
    res.render("index.ejs");
  }
});

//creat recipe add new recipe
router.get("/new", (req, res) => {
  res.render("recipes/new.ejs");
});

router.put("/:recipeId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const recipe = currentUser.recipes.id(req.params.recipeId);
  
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

// delete thr recipe page 

router.delete("/:recipeId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    
    currentUser.recipes.id(req.params.recipeId).deleteOne();
   
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
   console.log(req.body);
    currentUser.recipes.push(req.body);
    

    await currentUser.save();
    res.redirect(`/users/${req.session.user._id}/recipes`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
// Edit the page recipe 
router.get("/:recipeId/edit", async (req, res) => {
  const currentUser = await User.findById(req.session.user._id);
  const recipe = currentUser.recipes.id(req.params.recipeId);
  res.render("recipes/edit.ejs", { recipe });
});

//SHOW recipe page once edit 
router.get("/:recipeId", async (req, res) => {
  const currentUser = await User.findById(req.session.user._id);
  
  const recipe = currentUser.recipes.id(req.params.recipeId);

  res.render("recipes/show.ejs", { recipe });
});






module.exports = router;
