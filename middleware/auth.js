const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        // console.log('jwt token>>>>>>',token);
        const userId = jwt.verify(token, process.env.TOKEN_SECRET);
        // console.log(userId)
        const user= await User.findById(userId);
        // console.log(user);
        req.user = user;
        next();
    } catch(err) {
        console.log(err);
        return res.status(401).json({success: false});
    }
}