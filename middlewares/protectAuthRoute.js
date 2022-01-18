module.exports = function protectAuthRoute(req, res, next){
    if(!req.session.currentUser) next();
    else res.redirect("/dashboard") // VOIR ROUTE DASHBOARD
};