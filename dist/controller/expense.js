"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadExpense = exports.transactionStatus = exports.premium = exports.addExpense = void 0;
const user_1 = __importDefault(require("../models/user"));
// const Expense = require('../models/expense');
const order_1 = __importDefault(require("../models/order"));
const user_services_1 = __importDefault(require("../services/user-services"));
const S3services_1 = __importDefault(require("../services/S3services"));
const razorpay_1 = __importDefault(require("razorpay"));
const addExpense = (req, res) => {
    const { amount, description, category, userId } = req.body;
    console.log(req.body);
    req.user.createExpense({ amount, description, category })
        // Expense.create({amount, description, category, userId})
        .then((expense) => {
        res.status(201).json({ expense, success: true });
    })
        .catch((err) => {
        res.status(403).json({ success: false, error: err });
    });
};
exports.addExpense = addExpense;
const premium = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var rzp = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 2500;
        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                throw new Error(err);
            }
            order_1.default.create({ orderId: order.id, status: 'PENDING' }).then(() => {
                console.log(order.id);
                return res.status(201).json({ order_id: order.id, key_id: rzp.key_id });
            }).catch((err) => {
                throw new Error(err);
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: 'something went wrong', error: err });
    }
});
exports.premium = premium;
const transactionStatus = (req, res) => {
    try {
        const { payment_id, order_id, userId } = req.body;
        console.log(req.body);
        order_1.default.update({ paymentId: payment_id, status: 'successful', userId }, { where: { orderId: order_id } }).then(() => {
            user_1.default.update({ isPremiumuser: true }, { where: { id: userId } });
            return res.status(202).json({ success: true, message: 'transaction successful', premium: true });
        }).catch((err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' });
    }
};
exports.transactionStatus = transactionStatus;
const downloadExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield (0, user_services_1.default)(req, res);
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        // console.log(userId);
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = yield (0, S3services_1.default)(stringifiedExpenses, filename);
        res.status(201).json({ fileURL, success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ fileURL: '', success: false, err: err });
    }
});
exports.downloadExpense = downloadExpense;
