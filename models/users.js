const bcrypt = require('bcrypt')
module.exports = (sequelize , DataTypes)=>{
    const User = sequelize.define(
        'users',
        {
            id : {
                type : DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey : true,
            },
            firstName : { 
                type : DataTypes.STRING,
                allowNull : false
            },
            lastName : {
                type : DataTypes.STRING,
            },
            email : {
                type : DataTypes.STRING,
                allowNull : false
            },
            password : {
                type : DataTypes.STRING,
                allowNull : false
            },
            role: {
                type: DataTypes.ENUM("USER", "ADMIN"),
                defaultValue: "USER",
                allowNull : false,
            }

        },
        {
            tableName : "users",
            timestamps : true,
            hooks : {
                beforeCreate : (user)=>{
                    const hashedPassword = bcrypt.hashSync(user.password , bcrypt.genSaltSync(10))
                    user.password = hashedPassword
            

                }
            }
        }
    )
    User.associates = function(models){

    }

    return User;

}