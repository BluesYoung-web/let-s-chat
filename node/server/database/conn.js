/**
 * 连接数据库的模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 连接MongoDB数据库的函数
 * @param {string} dbName 数据库名
 */
const mongoConnect = function(dbName) {
    const mongoose = require('mongoose');
    let str = `mongodb://127.0.0.1:27017/${dbName}`;
    mongoose.connect(str, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (err) => {
        if (err) {
            throw err;
        } else{
            console.log("数据库连接成功");
        }
    });
}

/**
 * 连接MySQL数据库的函数
 * @param {string} dbName 数据库名
 */
const mysqlConnect = function(dbName) {
    const mysql = require('mysql');
    const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : dbName
    });
    connection.connect();
    return connection;
}

/**
 * 连接Redis数据库的函数
 */
const redisConnect = function() {
    const mongoose = require('mongoose');
    let str = `mongodb://127.0.0.1:27017/${dbName}`;
    mongoose.connect(str, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (err) => {
        if (err) {
            throw err;
        } else{
            console.log("数据库连接成功");
        }
    });
}

/**
 * 暴露
 */
module.exports = {
    mongoConnect,
    mysqlConnect,
    redisConnect
};