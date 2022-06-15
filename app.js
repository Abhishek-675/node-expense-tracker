const express = require('express');

const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database');
const routes = require('./routes/admin');

const app = express();

app.use(express.json());

app.use(routes);

sequelize
    .sync({
        // force: true
    })
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err))