const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database');
const routes = require('./routes/admin');

const app = express();
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

app.use(routes);

sequelize
    .sync({
        // force: true
    })
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err))