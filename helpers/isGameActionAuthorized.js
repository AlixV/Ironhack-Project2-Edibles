module.exports = function isGameActionAuthorized(action) {
  // test action
  switch (action) {
    case "eat":
    case "leave":
      // game action ok
      return true;
      break;

    default:
      // invalid game action
      return false;
      break;
  }
}