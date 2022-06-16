const User = require('../models/user');
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.postSignUp = (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const telephone = req.body.tel;
    const password = bcrypt.hashSync(req.body.pass, saltRounds);
    
    User.create({
        name: name,
        email: email,
        telephone: telephone,
        password: password
    }).then(() => {
        res.status(201).json({
            success: true,
            message: 'sign up successful'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(403).json({
            success: false,
            message: 'email or phone number already exits'
        })
    })
}