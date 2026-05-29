const validate = require("../middlewares/validate");
const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authors");
const { createAuthor, updateAuthor } = require("../validators/authors");
const { authenticate } = require("../utils/jwtHelper");
const { authorize } = require("../utils/authorize");
const { userRateLimiter } = require("../middlewares/rateLimitter");

router.post("/", authenticate, userRateLimiter, authorize("ADMIN"), validate(createAuthor), authorController.createAuthor);
router.get("/", authenticate, userRateLimiter, authorize("ADMIN" , "USER"), authorController.getAllAuthors);
router.get("/:id", authenticate, userRateLimiter, authorize("ADMIN" , "USER"), authorController.getAuthorById);
router.get("/:id/books", authenticate, userRateLimiter, authorize("ADMIN" , "USER"), authorController.getBooksByAuthorId);
router.put("/:id", authenticate, userRateLimiter, authorize("ADMIN"), validate(updateAuthor), authorController.updateAuthor);
router.delete("/:id", authenticate, userRateLimiter, authorize("ADMIN"), authorController.deleteAuthor);

module.exports = router;
