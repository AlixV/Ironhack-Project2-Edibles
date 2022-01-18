const router = require("express").Router();
const PlayerModel = require("../models/Player.model");
const protectPrivateRoute = require("../middlewares/protectPrivateRoute")

// ROUTES PREFIXED BY /player

router.get("/:id", protectPrivateRoute, (req, res, next) => {
    res.render("playerProfile", {
        player : req.session.currentUser
    })
})

 
// UPDATE
router.get("/update", (req, res) => {
	//const id = req.params.id; PAS UTILE BYE
    res.render("playerUpdate", {
        player : req.session.currentUser
    })

});

router.post("/update", (req, res) => {
	const currentUserId = req.session.currentUser._id;
	PlayerModel.findByIdAndUpdate(currentUserId, {pseudo : req.body.pseudo}, { new: true })
		.then((updatedPlayer) => {
            req.session.currentUser = updatedPlayer;
			console.log(updatedPlayer);
			res.redirect("/player"); 
		})
		.catch((e) => console.error(e));
});

// DELETE
const deletePlayer = async (req, res) => {
	const currentUserId = req.session.currentUser._id;
	try {
		await PlayerModel.findByIdAndDelete(currentUserId);
		req.session.destroy(function (err) {
            // cannot access session here anymore
            res.redirect("/");  
        });
	} catch (error) {
		console.error(error);
	}
};

router.get("/delete", deletePlayer);

// logout = > cad faire sortir le current user de current session. 
// Voir dans auth
// expose login status 




module.exports = router