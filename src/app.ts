import path from 'path';
import * as fs from "fs";
// const https = require('https');

import express from "express";
import cors from "cors";
import helmet from "helmet";
// const compression = require('compression');
import morgan from "morgan";


import dotenv from "dotenv";
dotenv.config();

import sequelize from './util/database';
import routes from './routes/routes';
import User from './models/user';
import Expense from './models/expense';
import Order from './models/order';
import ForgotPassword from './models/forgot-password';

const app = express();

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(cors());
app.use(express.json());
app.use(helmet());
// app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

// app.use((req, res, next) => {
//     User.findByPk(1)
//     .then(user => {
//         req.user = user;
//         console.log(user);
//         next();
//     })
//     .catch(err => console.log(err));
// });

app.use(routes);

app.use((req, res) => {
    console.log('urlll', req.url);
    res.sendFile(path.join(__dirname, `public/${req.url}`));
});

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

sequelize
    .sync({
        // force: true
    })
    .then(() => {
        // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT || 3000);
        app.listen(process.env.PORT || 3000);
    })
    .catch((err) => console.log(err))

//npm run start:dev
//NODE_ENV=production