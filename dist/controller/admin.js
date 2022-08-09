"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExpense = exports.getExpense = exports.getUsers = exports.postLogin = exports.postSignUp = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expense_1 = __importDefault(require("../models/expense"));
//sign-up
const postSignUp = (req, res) => {
    const { name, email, telephone, password } = req.body;
    console.log(req.body, password);
    const saltRounds = 10;
    bcrypt_1.default.genSalt(saltRounds, function (err, salt) {
        bcrypt_1.default.hash(password, salt, function (err, hash) {
            if (err) {
                console.log('unable to create new user');
                return res.json({ message: 'unable to create new user' });
            }
            user_1.default.create({ name, email, telephone, password: hash })
                .then(() => {
                res.status(201).json({ success: true, message: 'sign up successful' });
            })
                .catch((err) => {
                console.log(err);
                res.status(403).json({ success: false, message: 'email or phone number already exits' });
            });
        });
    });
};
exports.postSignUp = postSignUp;
function generateAccessToken(id) {
    return jsonwebtoken_1.default.sign(id, process.env.TOKEN_SECRET);
}
//login
const postLogin = (req, res) => {
    const { email, password } = req.body;
    console.log(password);
    user_1.default.findAll({ where: { email } })
        .then((user) => {
        if (user.length > 0) {
            bcrypt_1.default.compare(password, user[0].password, function (err, response) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: 'Something went wrong' });
                }
                if (response) {
                    console.log(JSON.stringify(user));
                    const jwtToken = generateAccessToken(user[0].id);
                    res.status(200).json({ token: jwtToken, userId: user[0].id, success: true, message: 'successfully logged in', premium: user[0].isPremiumuser });
                }
                else {
                    return res.status(401).json({ success: false, message: 'password do not match' });
                }
            });
        }
        else {
            return res.status(404).json({ success: false, message: 'user does not exist' });
        }
    });
};
exports.postLogin = postLogin;
//get-users
const getUsers = (req, res) => {
    user_1.default.findAll({ attributes: ['id', 'name'] }).then((user) => {
        res.status(200).json({ username: user });
    }).catch((err) => console.log(err));
};
exports.getUsers = getUsers;
//get expense
const getExpense = (req, res) => {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +req.query.limit || 10;
    let totalItems;
    const { userId } = req.body;
    console.log(userId);
    expense_1.default.findAll({ where: { userId } })
        .then((numExpenses) => {
        totalItems = numExpenses.length;
        return expense_1.default.findAll({
            where: { userId },
            offset: ((page - 1) * ITEMS_PER_PAGE),
            limit: ITEMS_PER_PAGE
        });
    })
        .then((expense) => {
        res.status(200).json({
            'expense': expense,
            'pagination': {
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            }
        });
    }).catch((err) => console.log(err));
};
exports.getExpense = getExpense;
//remove expense
const removeExpense = (req, res) => {
    const { id } = req.body;
    expense_1.default.destroy({ where: { id: id } }).then(() => {
        res.status(200).json({ success: true, message: 'deleted successfully' });
    });
};
exports.removeExpense = removeExpense;
