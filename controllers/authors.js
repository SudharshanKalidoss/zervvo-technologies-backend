const { ApiError } = require("../middlewares/apiErrors");
const { tryCatch } = require("../middlewares/tryCatch");
const { models } = require("../config/database");
const authorService = require("../services/authors");

exports.createAuthor = tryCatch(async (req, res) => {
  const { name } = req.body;
  const existingAuthor = await authorService.getSingleAuthorByWhere({ name });
  if (existingAuthor) {
    throw ApiError.BadRequest("Author with this name already exists");
  }

  const createdAuthor = await authorService.createAuthor({ name });
  return res.status(201).send(createdAuthor);
});

exports.getAllAuthors = tryCatch(async (req, res) => {
  const fields = req.query.fields ? req.query.fields.split(",").map((field) => field.trim()) : undefined;
  const authors = await authorService.getAllAuthors(fields);
  return res.status(200).send(authors);
});

exports.getAuthorById = tryCatch(async (req, res) => {
  const fields = req.query.fields ? req.query.fields.split(",").map((field) => field.trim()) : undefined;
  const author = await authorService.getAuthorById(req.params.id, fields);
  if (!author) {
    throw ApiError.NotFound("Author not found");
  }

  return res.status(200).send(author);
});

exports.getBooksByAuthorId = tryCatch(async (req, res) => {
  const authorFields = req.query.authorFields
    ? req.query.authorFields.split(",").map((field) => field.trim())
    : undefined;
  const bookFields = req.query.bookFields
    ? req.query.bookFields.split(",").map((field) => field.trim())
    : undefined;

  const author = await authorService.getAuthorWithBooks(
    models,
    req.params.id,
    authorFields,
    bookFields
  );

  if (!author) {
    throw ApiError.NotFound("Author not found");
  }

  return res.status(200).send(author);
});

exports.updateAuthor = tryCatch(async (req, res) => {
  const { name } = req.body;

  if (name) {
    const existingAuthor = await authorService.getSingleAuthorByWhere({ name });
    if (existingAuthor && existingAuthor.id !== Number(req.params.id)) {
      throw ApiError.BadRequest("Author with this name already exists");
    }
  }

  const updatedAuthor = await authorService.updateAuthor(req.params.id, req.body);
  if (!updatedAuthor) {
    throw ApiError.NotFound("Author not found");
  }

  return res.status(200).send(updatedAuthor);
});

exports.deleteAuthor = tryCatch(async (req, res) => {
  const deletedAuthor = await authorService.deleteAuthor(req.params.id);
  if (!deletedAuthor) {
    throw ApiError.NotFound("Author not found");
  }

  return res.status(200).send({ message: "Author deleted successfully" });
});
