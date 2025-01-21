const jwt = require('jsonwebtoken');

// RBAC Middleware  
const rbacMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token.' });
            }

            // Check if the user's role is in the required roles  
            if (!requiredRoles.includes(user.role)) {
                return res.status(403).json({ error: 'Access denied. You do not have the required role.' });
            }

            req.user = user; // Attach user info to request  
            next();
        });
    };
};

module.exports = rbacMiddleware;  
