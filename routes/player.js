const router = require("express").Router();

// this route is prefixed with /player

router.get("/", (req, res, next) => {
    res.render("playerProfile")
})




module.exports = router