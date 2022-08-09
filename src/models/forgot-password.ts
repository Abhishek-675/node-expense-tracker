import Sequelize from "sequelize";

import sequelize from '../util/database';

const ForgotPassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
});

export default ForgotPassword;