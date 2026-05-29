const { ApiError } = require("../middlewares/apiErrors");

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        throw ApiError.Forbidden("You do not have permission to access this resource");
    
    }

    next();
  };
};



