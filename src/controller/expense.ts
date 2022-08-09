import User from '../models/user';
// const Expense = require('../models/expense');
import Order from '../models/order';
import UserServices from '../services/user-services';
import S3Service from '../services/S3services';

import Razorpay from 'razorpay';

const addExpense = (req, res) => {
    const {amount, description, category, userId} = req.body;
    console.log(req.body);
    req.user.createExpense({amount, description, category})
    // Expense.create({amount, description, category, userId})
        .then((expense) => {
            res.status(201).json({expense, success: true});
        })
        .catch((err) => {
            res.status(403).json({success: false, error: err});
        })
};

const premium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 2500;

        rzp.orders.create({amount, currency: 'INR'}, (err, order) => {
            if (err) {
                throw new Error(err);
            }
            Order.create({orderId: order.id, status: 'PENDING'}).then(() => {
                console.log(order.id);
                return res.status(201).json({order_id: order.id, key_id: rzp.key_id})
            }).catch((err) => {
                throw new Error(err);
            })
        })
    } catch(err) {
        console.log(err);
        res.status(403).json({message: 'something went wrong', error: err});
    }
}

const transactionStatus = (req, res) => {
    try {
        const {payment_id, order_id, userId} = req.body;
        console.log(req.body);
            Order.update({paymentId: payment_id, status: 'successful', userId}, {where: {orderId: order_id}}).then(() => {
                User.update({isPremiumuser: true}, {where: {id: userId}});
                return res.status(202).json({success: true, message: 'transaction successful', premium: true});
            }).catch((err) => {
                throw new Error(err);
            })
    } catch(err) {
        console.log(err);
        res.status(403).json({error: err, message: 'Something went wrong'});
    }
}

const downloadExpense = async (req, res) => {
    try {
        const expenses = await UserServices(req, res);
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
    
        const userId = req.user.id;
        // console.log(userId);
    
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3Service(stringifiedExpenses, filename);
        res.status(201).json({fileURL, success: true});
    } catch(err) {
        console.log(err);
        res.status(500).json({fileURL: '', success: false, err: err})
    }

} 

export {addExpense, premium, transactionStatus, downloadExpense};