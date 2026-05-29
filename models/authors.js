const bcrypt = require('bcrypt')
module.exports = (sequelize , DataTypes)=>{
    const Author = sequelize.define(
        'authors',
        {
            id : {
                type : DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey : true,
            },
            name : { 
                type : DataTypes.STRING,
                allowNull : false,
                unique: true
            },


        },
        {
            tableName : "authors",
            timestamps : true,
            hooks : {}
        }
    )
    Author.associate = function(models){
        Author.hasMany(models.books, {
            foreignKey: "authorId",
            as: "books",
        });
    }

    return Author;

}