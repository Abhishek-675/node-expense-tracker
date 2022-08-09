import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Expense from '../models/expense';

import {user} from "../models/user";

//sign-up
const postSignUp = (req, res) => {
    const {name, email, telephone, password} = req.body;
    console.log(req.body, password)

    const saltRounds = 10;
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
                .catch((err) => {
                    console.log(err);
                    res.status(403).json({success: false, message: 'email or phone number already exits'})
                })
        })
    })
}

function generateAccessToken(id) {
    return jwt.sign(id, process.env.TOKEN_SECRET!);
}

//login
const postLogin = (req, res) => {
    const {email, password} = req.body;
    console.log(password)
    User.findAll({where: {email}})
        .then((user) => {
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

//get-users
const getUsers = (req, res) => {
    User.findAll({attributes: ['id', 'name']}).then((user) => {
        res.status(200).json({username: user});
    }).catch((err) => console.log(err));
}

//get expense
const getExpense = (req, res) => {

    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +req.query.limit || 10;
    let totalItems;

    const {userId} = req.body;
    console.log(userId)

    Expense.findAll({where: {userId}})
    .then((numExpenses) => {
        totalItems = numExpenses.length;
        return Expense.findAll({
            where: {userId},
            offset: ((page - 1) * ITEMS_PER_PAGE),
            limit: ITEMS_PER_PAGE
        })
    })
    .then((expense) => {
        res.status(200).json({
            'expense': expense,
            'pagination':  {
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            }
        });
    }).catch((err) => console.log(err));
}
//remove expense
const removeExpense = (req, res) => {
    const {id} = req.body;
    Expense.destroy({where: {id: id}}).then(() => {
        res.status(200).json({success: true, message: 'deleted successfully'})
    })
}

export {postSignUp, postLogin, getUsers, getExpense, removeExpense};
