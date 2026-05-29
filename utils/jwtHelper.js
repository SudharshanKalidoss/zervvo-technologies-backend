const JWT = require('jsonwebtoken')
const { ApiError } = require('../middlewares/apiErrors')


exports.signAccessToken = (payload) => {
  const options = { expiresIn: '7d' }
  const token = JWT.sign(payload, process.env.JWT_SECRET, options)
  return token
}

exports.signRefreshToken = (payload) => {
  const options = { expiresIn: '12d' }
  const token = JWT.sign(payload, process.env.JWT_REFRESH_SECRET, options)
  return token
}

exports.verifyAccessToken = (token) => {
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    console.log(error)
    throw ApiError.Unauthorized
  }
}


exports.verifyRefreshToken = (token) => {
  try {
    const decoded = JWT.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    return decoded;
  } catch (error) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      throw ApiError.Unauthorized("Refresh token expired");
    }

    throw ApiError.Unauthorized("Invalid refresh token");
  }
};

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const bearerToken = authHeader && authHeader.split(' ')
  const token = bearerToken && bearerToken[bearerToken.length - 1]

  try {
    if (!token) {
      throw ApiError.Unauthorized("Token not found !")
    }

    const decoded = this.verifyAccessToken(token)
    const { id, role, firstName, lastName , email } = decoded
    req.user = { id, role, firstName, lastName , email }
    next()
  } catch (error) {
    console.log(error)
    // throw ApiError.Unauthorized(error.message);
    return next(ApiError.Unauthorized(error.message))
  }
}



