const serverAddress = `${process.env.URL}`
let staticPath = `/uploads`

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "books",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      publishedYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      originalImage: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      imageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const file = this.image?.trim();
          return file ? `${serverAddress}${staticPath}/${file}` : null;
        },
      },
      originalImageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const file = this.originalImage?.trim();
          return file ? `${serverAddress}${staticPath}/${file}` : null;
        },
      },
    },
    {
      tableName: "books",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["authorId", "title"],
        },
      ],
    }
  );

  Book.associate = function (models) {
    Book.belongsTo(models.authors, {
      foreignKey: "authorId",
      as: "author",
    });
  };

  return Book;
};