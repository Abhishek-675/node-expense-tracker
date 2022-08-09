"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controller/admin");
const expense_1 = require("../controller/expense");
const forgot_password_1 = require("../controller/forgot-password");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/sign-up', admin_1.postSignUp);
router.post('/login', admin_1.postLogin);
router.post('/addexpense', auth_1.authenticate, expense_1.addExpense);
router.get('/get-users', admin_1.getUsers);
router.post('/get-expense', admin_1.getExpense);
router.post('/delete-expense', auth_1.authenticate, admin_1.removeExpense);
router.get('/download', auth_1.authenticate, expense_1.downloadExpense);
//premium-membership
router.get('/premium', auth_1.authenticate, expense_1.premium);
router.post('/transaction-status', auth_1.authenticate, expense_1.transactionStatus);
//reset-password
router.post('/forgot-password', forgot_password_1.forgotPassword);
router.get('/reset-password/:id', forgot_password_1.resetPassword);
router.get('/update-password/:resetPassId', forgot_password_1.updatepassword);
exports.default = router;
