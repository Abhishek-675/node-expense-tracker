const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const forgotPasswordSchema= new Schema({
    active:{
        type:Boolean
    },
    expiresby:{
        type:Date
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
});

module.exports= mongoose.model('ForgotPassword', forgotPasswordSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const ForgotPassword = sequelize.define('forgotpassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
//     expiresby: Sequelize.DATE
// });

// module.exports = ForgotPassword;