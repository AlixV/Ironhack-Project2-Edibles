module.exports = function cleanSessionFromPreviousGame(req, res, next){
  if (req.session.game) {
    // deleting the object in session used to store game info
    delete req.session['game'];
  }
  next();
};