// const express = require("express") + const router = new express.Router();
const router = require("express").Router();

const PlayerModel = require("./../models/Player.model");
const bcrypt = require("bcrypt");
const protectAuthRoute = require("../middlewares/protectAuthRoute");
const protectPrivateRoute = require("../middlewares/protectPrivateRoute");

// - Display the SIGNUP FORM
router.get("/signup", protectAuthRoute, (req, res) => {
  res.render("signup.hbs");
});

// - Display the SIGNIN FORM
router.get("/signin", protectAuthRoute, (req, res) => {
  res.render("signin.hbs");
});

// // - REGISTER NEW PLAYER
router.post("/signup", async (req, res, next) => {
  try {
    // get the player's input :
    const newPlayer = { ...req.body };
    // check if all mandatory fields are present :
    if (!newPlayer.pseudo || !newPlayer.email || !newPlayer.password) {
      req.flash("error", "Veuillez renseigner tous les champs"); // => Alix Créer Flash DONE
      res.redirect("/signup");
    } else {
      // check if email exists in db :
      const foundPlayer = await PlayerModel.findOne({ email: newPlayer.email });
      console.log("foundPlayer", foundPlayer);
      if (foundPlayer) {
        console.log("---- player found in db");
        req.flash("error", "Email déjà enregistré");
        res.redirect("/signin");
      } else {
        // HASH + SALT the password !!
        const hashedPwd = bcrypt.hashSync(newPlayer.password, 10);
        newPlayer.password = hashedPwd; // pourquoi 2 fois ? Alix
        console.log(`hashedPwd`, hashedPwd);
        // Create new player un db :
        await PlayerModel.create(newPlayer);
        req.flash(
          "sucess",
          "Félicitations ! Vous êtes enregistré ! Connectez-vous s'il vous plaît."
        );
        res.redirect("/signin");
      }
    }
  } catch (error) {
    // handling errors on form fields
    // console.log("signup - error: ", error);
    let errorMessage = "";
    for (field in error.errors) {
      errorMessage += error.errors[field].message + "\n";
    }
    req.flash("error", errorMessage); // affiche toutes erreurs
    res.redirect("/signup");
  }
});

// CONNECTION UTILISATEUR DÉJÀ ENREGISTRÉ
router.post("/signin", async (req, res, next) => {
  try {
    // get the player's input :
    const { email, password } = req.body;
    console.log("req.body", email, password);
    // check if all mandatory fields are present :
    if (!email || !password) {
      // Pourquoi "||" et non "&&" ?
      req.flash("error", "Veuillez renseigner tous les champs");
      res.redirect("/signin");
    } else {
      // find the player in db :
      const foundPlayer = await PlayerModel.findOne({ email: email });
      // console.log('foundPlayer', foundPlayer);
      if (!foundPlayer) {
        // console.log('before redirect to signup because email unknown')
        req.flash(
          "error",
          "Email inconnu, veuillez vous enregistrer s'il vous plaît"
        );
        res.redirect("/signup");
      } else {
        // compare the passwords via bcrypt :
        const isPwdOk = bcrypt.compareSync(password, foundPlayer.password);
        // console.log(`isPwdOk`, isPwdOk);
        if (!isPwdOk) {
          // if password problem
          req.flash("error", "Informations erronéées");
          res.redirect("/signin");
        } else {
          // email & password ok, ready to finish authentication
          // transform the foundPlayer into an object :
          const foundPlayerObjet = foundPlayer.toObject();
          // delete the password for more safety :
          delete foundPlayerObjet.password;
          // create the currentPlayer in session :
          req.session.currentUser = foundPlayerObjet;
          console.log(req.session.currentUser);
          // display success message & redirect
          req.flash("sucess", "Connection réussie !");
          res.redirect("/"); // ROUTE À VÉRIFIER
        }
      }
    }
  } catch (error) {
    // handling errors on form fields
    // console.log("signin - error: ", error);
    let errorMessage = "";
    for (field in error.errors) {
      errorMessage += error.errors[field].message + "\n";
    }
    req.flash("error", errorMessage);
    res.redirect("/signin");
  }
});

// LOG OUT
router.get("/logout", protectPrivateRoute, (req, res, next) => {
  console.log(req.session.currentUser);
  req.session.destroy(function (err) {
    // cannot access session here anymore
    res.redirect("/signin");
  });
});

module.exports = router;
