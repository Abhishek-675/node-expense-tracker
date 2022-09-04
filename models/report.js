const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema({
  fileUrl: { type: String, required: true },
  userId:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:'User'
}
});

module.exports = mongoose.model("Report", reportSchema);

// const Sequelize= require('sequelize');

// const sequelize= require('../util/database');

// const Report= sequelize.define('report', {
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     fileUrl:{
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

// module.exports= Report;
