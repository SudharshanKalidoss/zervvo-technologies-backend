require('dotenv').config();
const express = require("express");
const morgan = require("morgan")
const { initialRoutes } = require('./routes');
const app = express();
const port = process.env.PORT || 3001
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');


app.use(morgan('dev'))

require("./config/database")

app.use(express.json());

app.get("/" , (req , res , next)=>{
    return res.status(200).send({message : "Server is running"})
})

initialRoutes(app);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))




app.use(errorHandler)

app.listen(port , ()=>{
    console.log(`Server running on Port ${port}`)
})