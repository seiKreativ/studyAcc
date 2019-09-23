const Sequelize = require('sequelize');

const db = new Sequelize(
    'oUyCsXhXyi',
    'oUyCsXhXyi',
    'IzgttKiqZr',

    {
        dialect: 'mysql',
        host: 'remotemysql.com',
        operatorsAliases: false,
        logging: false
    }
);

const Users = db.define('users', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }


)


db.sync().then(() => console.log("Database is ready"))

exports = module.exports = {
    db,
    Users
}