"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const authenticate = (req, res, next) => {
    try {
        const token = req.header('authorization');
        console.log(token);
        const userid = Number(jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET));
        user_1.default.findByPk(userid).then((user) => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch((err) => { throw new Error(err); });
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
};
exports.authenticate = authenticate;
