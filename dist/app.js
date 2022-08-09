"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
// const https = require('https');
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// const compression = require('compression');
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = __importDefault(require("./util/database"));
const routes_1 = __importDefault(require("./routes/routes"));
const user_1 = __importDefault(require("./models/user"));
const expense_1 = __importDefault(require("./models/expense"));
const order_1 = __importDefault(require("./models/order"));
const forgot_password_1 = __importDefault(require("./models/forgot-password"));
const app = (0, express_1.default)();
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');
const accessLogStream = fs.createWriteStream(path_1.default.join(__dirname, 'access.log'), { flags: 'a' });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
// app.use(compression());
app.use((0, morgan_1.default)('combined', { stream: accessLogStream }));
// app.use((req, res, next) => {
//     User.findByPk(1)
//     .then(user => {
//         req.user = user;
//         console.log(user);
//         next();
//     })
//     .catch(err => console.log(err));
// });
app.use(routes_1.default);
app.use((req, res) => {
    console.log('urlll', req.url);
    res.sendFile(path_1.default.join(__dirname, `public/${req.url}`));
});
user_1.default.hasMany(expense_1.default);
expense_1.default.belongsTo(user_1.default);
user_1.default.hasMany(order_1.default);
order_1.default.belongsTo(user_1.default);
user_1.default.hasMany(forgot_password_1.default);
forgot_password_1.default.belongsTo(user_1.default);
database_1.default
    .sync({
// force: true
})
    .then(() => {
    // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
})
    .catch((err) => console.log(err));
//npm run start:dev
//NODE_ENV=production
