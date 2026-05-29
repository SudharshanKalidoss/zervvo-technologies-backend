const { Op } = require("sequelize");
const { models } = require("../config/database");

const Books = models.books;

exports.getBookByTitleAndAuthor = async (
  title,
  authorId,
  excludeBookId = null
) => {
  const where = {
    title,
    authorId,
  };

  if (excludeBookId) {
    where.id = {
      [Op.ne]: excludeBookId,
    };
  }

  return await Books.findOne({
    where,
  });
};

exports.createBook = async (bookData) => {
  return await Books.create(bookData);
};

exports.getBooksByAuthorId = async (
  modelsParam,
  authorId,
  fields = ["id", "title", "content", "publishedYear", "authorId"]
) => {
  const BooksModel = modelsParam.books;
  return await BooksModel.findAll({
    where: { authorId },
    attributes: fields,
  });
};

exports.getAllBooks = async (
  fields = ["id", "title", "content", "publishedYear", "authorId" , "image" , "originalImage" , "imageUrl" , "originalImageUrl"]
) => {
  return await Books.findAll({
    attributes: fields,
  });
};

exports.getBookById = async (
  id,
  fields = ["id", "title", "content", "publishedYear", "authorId" , "image" , "originalImage" , "imageUrl" , "originalImageUrl"]
) => {
  return await Books.findByPk(id, {
    attributes: fields,
    include  : [
        {
            model : models.authors,
            as : "author",
            attributes : ["id" , "name"]
        }
    ] 
  });
};

exports.getBookByWhere = async (where = {}, fields = ["id"]) => {
  return await Books.findOne({
    where,
    attributes: fields,
  });
};

exports.updateBook = async (id, bookData) => {
  const book = await Books.findByPk(id);
  if (!book) {
    return null;
  }

  return await book.update(bookData);
};

exports.deleteBook = async (id) => {
  const book = await Books.findByPk(id);
  if (!book) {
    return null;
  }

  await book.destroy();
  return book;
};