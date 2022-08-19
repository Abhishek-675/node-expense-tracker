const path = require('path');
const fs = require('fs');
// const https = require('https');

const express = require('express');

const app = express();

const cors = require('cors');
const helmet = require("helmet");
// const compression = require('compression');
const morgan = require('morgan');

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(cors());
app.use(express.json());
app.use(helmet());
// app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

//env
const dotenv = require('dotenv');
dotenv.config();

//database
const sequelize = require('./util/database');

//routes
const adminRoutes = require('./routes/admin');
const expenseRoutes= require('./routes/expense');
const premiumRoutes= require('./routes/premium');

//models
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgot-password');

// associations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasOne(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

//routes
app.use(adminRoutes);
app.use(expenseRoutes);
app.use(premiumRoutes);

// app.use((req, res) => {
//     console.log('>>>', req.url);
//     res.sendFile(path.join(__dirname, `public/${req.url}`));
// });

//server
sequelize
    .sync({
        // force: true
    })
    .then(() => {
        // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT || 3000);
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log(err))

