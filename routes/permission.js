
exports.adminOnly = function (admin) {
  return function (req, res, next) {
    /* if (req.current_user && req.current_user.admin) */
    if (req.current_user && admin)
      next(); // role is allowed, so continue on the next middleware
    else {
      return res.status(403).json({ message: "Forbidden" }); // user is forbidden
    }
  };
};