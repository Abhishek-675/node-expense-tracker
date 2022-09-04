const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const orderSchema= new Schema({
    paymentId:{
        type:String,
        // required:true
    },
    orderId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
});

module.exports= mongoose.model('Order', orderSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentId: {
//         type: Sequelize.STRING,
//         allowNull: true
//     },
//     orderId: {
//         type: Sequelize.STRING,
//         allowNull: true
//     },
//     status: {
//         type: Sequelize.STRING,
//         allowNull: true
//     }
// });

// module.exports = Order;