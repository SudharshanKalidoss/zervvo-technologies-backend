const { ApiError } = require("../middlewares/apiErrors");
const { tryCatch } = require("../middlewares/tryCatch");
const bookService = require("../services/books");
const authorService = require("../services/authors");
const { generateBookImages } = require("../utils/imageProcessor");

const serverAddress = `${process.env.URL}`
let staticPath = `/uploads`

const path = require('path')
const fs = require('fs').promises


exports.createBook = tryCatch(async (req, res) => {
  const { authorId, title } = req.body;
  const author = await authorService.getAuthorById(authorId, ["id"]);
  if (!author) {
    throw ApiError.BadRequest("Author not found");
  }

  const duplicateBook = await bookService.getBookByTitleAndAuthor(title, authorId);
  if (duplicateBook) {
    throw ApiError.BadRequest("This author already has a book with the same title");
  }

  const createdBook = await bookService.createBook(req.body);
  return res.status(201).send(createdBook);
});

exports.getAllBooks = tryCatch(async (req, res) => {
  const fields = req.query.fields
    ? req.query.fields.split(",").map((field) => field.trim())
    : undefined;

  const books = await bookService.getAllBooks(fields);
  return res.status(200).send(books);
});

exports.getBookById = tryCatch(async (req, res) => {
  const fields = req.query.fields
    ? req.query.fields.split(",").map((field) => field.trim())
    : undefined;

  const book = await bookService.getBookById(req.params.id, fields);
  console.log(book , "adsasdasdasdasd")
  if (!book) {
    throw ApiError.NotFound("Book not found");
  }

  return res.status(200).send(book);
});

exports.updateBook = tryCatch(async (req, res) => {
  const existingBook = await bookService.getBookById(req.params.id, ["id", "title", "authorId"]);
  if (!existingBook) {
    throw ApiError.NotFound("Book not found");
  }

  const newAuthorId = req.body.authorId ?? existingBook.authorId;
  const newTitle = req.body.title ?? existingBook.title;

  if (req.body.authorId) {
    const author = await authorService.getAuthorById(req.body.authorId, ["id"]);
    if (!author) {
      throw ApiError.BadRequest("Author not found");
    }
  }

  const duplicateBook = await bookService.getBookByTitleAndAuthor(
    newTitle,
    newAuthorId,
    req.params.id
  );
  if (duplicateBook) {
    throw ApiError.BadRequest("This author already has a book with the same title");
  }

  const updatedBook = await bookService.updateBook(req.params.id, req.body);
  if (!updatedBook) {
    throw ApiError.NotFound("Book not found");
  }

  return res.status(200).send(updatedBook);
});

exports.deleteBook = tryCatch(async (req, res) => {
  const deletedBook = await bookService.deleteBook(req.params.id);
  if (!deletedBook) {
    throw ApiError.NotFound("Book not found");
  }

  return res.status(200).send({ message: "Book deleted successfully" });
});


exports.uploadBookCover = tryCatch(async (req, res) => {
  const bookId = req.params.id;

  const image = req.file
  if (!image || image.length == 0) {
    throw ApiError.BadRequest("Image file is required")
  }
  const fieldsToInclud = ['id']

  const book = await bookService.getBookById(bookId, fieldsToInclud)

  if(!book){
    throw ApiError.BadRequest("Book not found")
  }



  const originalPath = path.join(image.destination, image.filename)
  const fileNameWithoutExtension = path.basename(
    image.filename,
    path.extname(image.filename)
  )
  const fileName = `${fileNameWithoutExtension}${bookId}`
  const resizedFilename = `${fileName}.webp`
  const resizedDir = path.join(image.destination, '..', 'resized')

  await generateBookImages(originalPath, resizedDir, fileName)




  book.image = `books/resized/${resizedFilename}`
  book.originalImage = `books/original/${image.filename}`
  await book.save()

  return res.status(200).send({
    message: "Book cover uploaded successfully",
    image:  `${serverAddress}${staticPath}/${book.image}`,
    originalImage: `${serverAddress}${staticPath}/${book.originalImage}`,
  })
})


