const validate = require("../middlewares/validate");

const router = require("express").Router();

const {userRegistration, login} = require("../validators/users")

const authController = require("../controllers/auth");
const { rateLimiter } = require("../middlewares/rateLimitter");

router.post("/register" ,rateLimiter , validate(userRegistration) ,authController.registerUser  )

router.post("/login" ,rateLimiter, validate(login) , authController.userLogin) 

module.exports = router;