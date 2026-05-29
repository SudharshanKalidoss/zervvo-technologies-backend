const { ApiError } = require("../middlewares/apiErrors");
const { tryCatch } = require("../middlewares/tryCatch");
const userService = require("../services/users")
const bcrypt = require("bcrypt");
const { signAccessToken, signRefreshToken } = require("../utils/jwtHelper");

exports.registerUser = tryCatch(async (req  , res)=>{
    const body = req.body;
    const emailWhere = {email : body.email};
    const user = await userService.getSingleUserByWhere(emailWhere);
    if(user){
        throw ApiError.BadRequest("User with this email already exists")
    }
    const createdUser = await userService.createUser(body);

    const accessToken = signAccessToken({
      id: createdUser.id,
      email: createdUser.email,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      role : createdUser.role
    })
    const refreshToken = signRefreshToken({
      id: createdUser.id,
      email: createdUser.email,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      role: createdUser.role,
    })


    const { ...restOfUser } = createdUser.toJSON()
    delete restOfUser.password

    return res.status(200).send({ accessToken, refreshToken, user: restOfUser });
});


exports.userLogin = tryCatch(async (req, res) => {
  const { email, password } = req.body
  const loginWhere = { email: email }

  let include = ['id', 'firstName', 'lastName' , 'password', 'role']
  const userFound = await userService.getSingleUserByWhere(loginWhere, include)
  if (!userFound) {
    throw ApiError.NotFound("User not found!")
  }

  if (userFound && (await bcrypt.compare(password, userFound.password))) {

    const accessToken = signAccessToken({
      id: userFound.id,
      email: userFound.email,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      role : userFound.role
    })
    const refreshToken = signRefreshToken({
      id: userFound.id,
      email: userFound.email,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      role: userFound.role,
    })


    const { ...restOfUser } = userFound.toJSON()
    delete restOfUser.password
    return res.status(200).send({ accessToken, refreshToken, user: restOfUser })
  } else {
    throw ApiError.BadRequest('Invalid password')
  }
})


