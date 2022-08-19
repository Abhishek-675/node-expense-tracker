const express = require('express');

const adminRoutes = express.Router();

const adminController = require('../controller/admin');

//login and signup
adminRoutes.post('/sign-up', adminController.signUp);

adminRoutes.post('/login', adminController.login);

//reset-password
adminRoutes.post('/forgot-password', adminController.forgotPassword);

adminRoutes.get('/reset-password/:id', adminController.resetPassword);

adminRoutes.get('/update-password/:resetPassId', adminController.updatepassword);

module.exports = adminRoutes;