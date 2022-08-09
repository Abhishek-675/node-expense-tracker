import Sequelize from "sequelize";

import sequelize from '../util/database';

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    orderId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

export default Order;