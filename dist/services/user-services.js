"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getExpenses = (req, res) => {
    return req.user.getExpenses();
};
exports.default = getExpenses;
