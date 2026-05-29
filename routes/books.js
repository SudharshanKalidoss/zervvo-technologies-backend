const validate = require("../middlewares/validate");
const express = require("express");
const router = express.Router();
const bookController = require("../controllers/books");
const { createBook, updateBook } = require("../validators/books");
const { authenticate } = require("../utils/jwtHelper");
const { authorize } = require("../utils/authorize");
const { userRateLimiter } = require("../middlewares/rateLimitter");
const { imageUpload } = require("../middlewares/multer");

router.post("/", authenticate, userRateLimiter, authorize("ADMIN"), validate(createBook), bookController.createBook);
router.get("/", authenticate, userRateLimiter, authorize("ADMIN" , "USER"), bookController.getAllBooks);
router.get("/:id", authenticate, userRateLimiter, authorize("ADMIN" , "USER"), bookController.getBookById);
router.put("/:id", authenticate, userRateLimiter, authorize("ADMIN"), validate(updateBook), bookController.updateBook);
router.delete("/:id", authenticate, userRateLimiter, authorize("ADMIN"), bookController.deleteBook);

router.post("/:id/upload-image", authenticate, userRateLimiter, authorize("ADMIN"),imageUpload.single("image"), bookController.uploadBookCover);

module.exports = router;
