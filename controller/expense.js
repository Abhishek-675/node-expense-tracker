const User = require('../models/user');
const Expense = require('../models/expense');

exports.addExpense = (req, res, next) => {
    const {amount, description, category, userId} = req.body;
    console.log(req.body);
    // const userId = req.body.userId;
    // User.findAll({where: {userId}}).then(user => req.user = user); req.user.createExpense
    Expense.create({amount, description, category, userId})
        .then(expense => {
            res.status(201).json({expense, success: true});
        })
        .catch(err => {
            res.status(403).json({success: false, error: err});
        })
}