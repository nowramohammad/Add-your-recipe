const express = require("express");
const router = express.Router();

const User = require("../models/user.js");

// router view pages index for login 
router.get("/", async (req,res) => {
    const user = await User.findById(req.session.user._id);
    const recipes = user.recipes;
    if (req.session.user) {
        res.render("recipes/index.ejs", { recipes});
    } else {
        res.render("index.ejs");
    }

    
});
// router to the new page view
router.get("/new", (req, res) => {
    res.render("recipes/new.ejs")
});
router.put("/:recipeId", async (req,res) => {
    try{
        const currentUser = await User.findById(req.session.user._id);
        const recipe = currentUser.recipes.id(req.params.recipeId);
        recipe.set(req.body);
        await currentUser.save();
        res.redirect(
            `/users/${req.session.user._id}/recipes/${req.params.recipeId}`

        );

    }catch (error) {
        console.log(error);
        res.redirect("/")
    }
});
// delete the recipe route
router.delete("/:recipeId", async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      
      currentUser.applications.id(req.params.recipeIdId).deleteOne();
      
      await currentUser.save();
  
      res.redirect(`/users/${req.session.user._id}/recipes`);
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  });
  // as the post route 
  router.post("/", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
       currentUser.recipe.push(req.body);
       await currentUser.save();
       res.redirect(`/users/${req.session.user._id}/recipes`);
    
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
  });
  
  // edit the recipe route
  router.get("/:recipeId/edit", async (req,res) => {
    const currentUser = await User.findById(req.session.user._id);
    const recipe = currentUser.recipes.id(reqparams.recipeId);
    res.render("recipes/edit.ejs",{ recipe });
  });
// the show page in the view router
router.get("/:recipeId", async (req, res) => {
    const currentUser= await User.findById(req.session.user._id);
    const recipe = currentUser.recipes.id(req.params.recipeId)
     res.render("recipes/show.ejs", {recipe});
});
module.exports = router; 