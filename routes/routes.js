const express = require('express');

const adminController = require('../controller/admin');
const expenseController = require('../controller/expense');
const passwordController = require('../controller/forgot-password');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/sign-up', adminController.postSignUp);

router.post('/login', adminController.postLogin);

router.post('/addexpense', authMiddleware.authenticate, expenseController.addExpense);

router.get('/get-users', adminController.getUsers);

router.post('/get-expense', authMiddleware.authenticate, adminController.getExpense);

router.post('/delete-expense', authMiddleware.authenticate, adminController.removeExpense);

router.get('/download', authMiddleware.authenticate, expenseController.downloadExpense);

//premium-membership
router.get('/premium', authMiddleware.authenticate, expenseController.premium);

router.post('/transaction-status', authMiddleware.authenticate, expenseController.transactionStatus);

//reset-password
router.post('/forgot-password', passwordController.forgotPassword);

router.get('/reset-password/:id', passwordController.resetPassword);

router.get('/update-password/:resetPassId', passwordController.updatepassword);

module.exports = router;