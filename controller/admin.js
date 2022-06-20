const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Expense = require('../models/expense');

const saltRounds = 10;

exports.postSignUp = (req, res, next) => {

    const {name, email, telephone, password} = req.body;
    console.log(req.body)
    console.log(password)
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                console.log('unable to create new user');
                return res.json({message: 'unable to create new user'})
            }
            User.create({name, email, telephone, password: hash})
                .then(() => {
                res.status(201).json({success: true, message: 'sign up successful'})
                })
                .catch(err => {
                    console.log(err);
                    res.status(403).json({success: false, message: 'email or phone number already exits'})
                })
        })
    })
    
}

function generateAccessToken(id) {
    return jwt.sign(id, process.env.TOKEN_SECRET);
}

exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;
    console.log(password)
    User.findAll({where: {email}})
        .then(user => {
            if (user.length > 0) {
                bcrypt.compare(password, user[0].password, function(err, response) {
                    if (err) {
                        console.log(err);
                        return res.json({success: false, message: 'Something went wrong'});
                    }
                    if (response) {
                        console.log(JSON.stringify(user));
                        const jwtToken = generateAccessToken(user[0].id);
                        res.status(200).json({token: jwtToken, userId: user[0].id, success: true, message: 'successfully logged in', premium: user[0].isPremiumuser});
                    }
                    else {
                        return res.status(401).json({success: false, message: 'password do not match'});
                    }
                })
            }
            else {
                return res.status(404).json({success: false, message: 'user does not exist'});
            }
        })
}

exports.getUsers = (req, res) => {
    User.findAll({attributes: ['id', 'name']}).then(user => {
        res.status(200).json({username: user});
    }).catch(err => console.log(err));
}

exports.getExpense = (req, res) => {
    const userId = req.body;
    console.log(userId.userId)
    Expense.findAll({where: {userid: userId.userId}}).then(expense => {
        res.status(200).json({expense: expense});
    }).catch(err => console.log(err));
}

exports.removeExpense = (req, res) => {
    const id = req.body;
    Expense.destroy({where: {id: id.id}}).then(() => {
        res.status(200).json({success: true, message: 'deleted successfully'})
    })
}
