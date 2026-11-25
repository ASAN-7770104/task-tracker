// M7: middleware factory - requireRole('admin') returns a new middleware
function requireRole(role) {
  return function (req, res, next) {
    const user = req.session.user;
    if (!user || user.role !== role) {
      return res.status(403).render('403', { title: 'Forbidden', requiredRole: role });
    }
    next();
  };
}

module.exports = requireRole;
