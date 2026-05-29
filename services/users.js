const { models } = require("../config/database");

const Users = models.users;

exports.createUser = async(userData)=>{
    return await Users.create(userData);
}

exports.getSingleUserByWhere = async(where = {} , fields = ["id"])=>{
    return await Users.findOne({
        where : where ,
        attributes : fields
    });
}