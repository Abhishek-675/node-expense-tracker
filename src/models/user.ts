import Sequelize from "sequelize";

import sequelize from '../util/database';

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    telephone: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isPremiumuser: Sequelize.BOOLEAN
});

export default User;

export type user = {
    id: number,
    name: string,
    email: string,
    telephone: string,
    password: string,

}
