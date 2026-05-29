const { models } = require("../config/database");

const Authors = models.authors;

exports.createAuthor = async (authorData) => {
  return await Authors.create(authorData);
};

exports.getAllAuthors = async (fields = ["id", "name", "createdAt", "updatedAt"]) => {
  return await Authors.findAll({
    attributes: fields,
  });
};

exports.getAuthorById = async (id, fields = ["id", "name", "createdAt", "updatedAt"]) => {
  return await Authors.findByPk(id, {
    attributes: fields,
  });
};

exports.getSingleAuthorByWhere = async (where = {}, fields = ["id"]) => {
  return await Authors.findOne({
    where,
    attributes: fields,
  });
};

exports.getAuthorWithBooks = async (
  modelsParam,
  id,
  authorFields = ["id", "name", "createdAt", "updatedAt"],
  bookFields = ["id", "title", "content", "publishedYear", "authorId"]
) => {
  return await modelsParam.authors.findByPk(id, {
    attributes: authorFields,
    include: [
      {
        model: modelsParam.books,
        as: "books",
        attributes: bookFields,
      },
    ],
  });
};

exports.updateAuthor = async (id, authorData) => {
  const author = await Authors.findByPk(id);
  if (!author) {
    return null;
  }

  return await author.update(authorData);
};

exports.deleteAuthor = async (id) => {
  const author = await Authors.findByPk(id);
  if (!author) {
    return null;
  }

  await author.destroy();
  return author;
};
