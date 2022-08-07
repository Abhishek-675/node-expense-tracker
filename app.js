const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
// const compression = require('compression');
const morgan = require('morgan');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

const sequelize = require('./util/database');
const routes = require('./routes/routes');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgot-password');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {falgs: 'a'});

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
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log(err))

//npm run start:dev