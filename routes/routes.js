const express = require('express');

const adminController = require('../controller/admin');
const expenseController = require('../controller/expense');
const passwordController = require('../controller/forgot-password');

const router = express.Router();

router.post('/sign-up', adminController.postSignUp);

router.post('/login', adminController.postLogin);

router.post('/addexpense', expenseController.addExpense);

router.get('/premium', expenseController.premium);

router.post('/transaction-status', expenseController.transactionStatus);

router.get('/get-users', adminController.getUsers);

router.post('/get-expense', adminController.getExpense);

router.post('/delete-expense', adminController.removeExpense);

router.post('/forgot-password', passwordController.forgotPassword);

module.exports = router;