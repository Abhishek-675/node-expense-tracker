const express = require('express');

const adminController = require('../controller/admin');
const expenseController = require('../controller/expense');

const router = express.Router();

router.post('/sign-up', adminController.postSignUp);

router.post('/login', adminController.postLogin);

router.post('/addexpense', expenseController.addExpense);

router.get('/premium', expenseController.premium);

router.post('/transaction-status', expenseController.transactionStatus);

module.exports = router;