const { Sequelize, DataTypes } = require('sequelize')
const fs = require('fs')
const path = require('path')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',

    logging: false,

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
)

const models = {}

fs.readdirSync(path.join(__dirname, '/../models'))
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, '/../models', file))(
      sequelize,
      DataTypes
    )

    models[model.name] = model
  })

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

sequelize
  .sync({alter : true})
  .then(() => {
    console.log('Database synced')
  })
  .catch((err) => {
    console.error('DB Sync Error:', err)
  })

module.exports = { sequelize, models }