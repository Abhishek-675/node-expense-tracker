import {Router} from 'express';

import {postSignUp, postLogin, getUsers, getExpense, removeExpense} from '../controller/admin';
import {addExpense, premium, transactionStatus, downloadExpense} from '../controller/expense';
import {forgotPassword, resetPassword, updatepassword} from '../controller/forgot-password';
import {authenticate} from '../middleware/auth';

const router = Router();

router.post('/sign-up', postSignUp);

router.post('/login', postLogin);

router.post('/addexpense', authenticate, addExpense);

router.get('/get-users', getUsers);

router.post('/get-expense',  getExpense);

router.post('/delete-expense', authenticate, removeExpense);

router.get('/download', authenticate, downloadExpense);

//premium-membership
router.get('/premium', authenticate, premium);

router.post('/transaction-status', authenticate, transactionStatus);

//reset-password
router.post('/forgot-password', forgotPassword);

router.get('/reset-password/:id', resetPassword);

router.get('/update-password/:resetPassId', updatepassword);

export default router;