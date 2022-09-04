const { Op } = require("sequelize");

const UserServices = require("../services/user-services");
const S3Service = require("../services/S3services");

const User = require("../models/user");
const Expense = require("../models/expense");
const Report = require("../models/report");

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const expense = new Expense({
      amount: amount,
      description: description,
      category: category,
      userId: req.user._id,
    });
    await expense.save();
    res
      .status(201)
      .json({ success: true, message: "succesfully added", expense });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "server error" });
  }
};

exports.removeExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    await Expense.findByIdAndRemove(expenseId);
    res.status(200).json({ success: true, message: "deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "server error" });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const userId = req.query.userId;
    // console.log('>>>custom>>>>',userId,'<<<<<<<');
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +req.query.limit || 1;

    const numExpenses = await Expense.find({ userId: userId });
    const totalItems = numExpenses.length;
    const expense = await Expense.find({ userId: userId })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.status(200).json({
      expense: expense,
      pagination: {
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.downloadExpense = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    // console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    // console.log(userId);

    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Service.uploadToS3(stringifiedExpenses, filename);
    // console.log('fileurl',fileURL)
    const newReport= new Report({fileUrl: fileURL, userId: req.user._id});
    newReport.save();
    res.status(201).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURL: "", success: false, err: err });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({userId: req.user._id});
    res.status(200).json(reports);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getUsers = async (req, res) => {
  User.find({_id: { $ne: req.user.id }})
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => console.log(err));
};
