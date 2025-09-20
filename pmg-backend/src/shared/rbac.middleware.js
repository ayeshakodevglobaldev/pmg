const ROLES = require('./roles');

/**
 * Middleware to enforce role-based access control.
 * @param {Array} allowedRoles - List of roles allowed to access the route.
 */
function authorize(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role']; // Assume role is passed in the request header for simplicity

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
}

module.exports = authorize;