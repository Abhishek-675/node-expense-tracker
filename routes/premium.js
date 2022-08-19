const express = require('express');

const premiumRoutes = express.Router();

const premiumController = require('../controller/premium');
const authMiddleware = require('../middleware/auth');

premiumRoutes.get('/premium', authMiddleware.authenticate, premiumController.premium);

premiumRoutes.post('/transaction-status', authMiddleware.authenticate, premiumController.transactionStatus);

module.exports = premiumRoutes;