const Expense= require('../models/expense');

exports.getExpenses = (req, res) => {
    return Expense.find({userId: req.user._id});
}