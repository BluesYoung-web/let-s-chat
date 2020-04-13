/**
 * 连接数据库的模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 引入配置文件
 */
const config = require('../config');

/**
 * mysql查询方法（暴露）
 */
const mysqlQuery = async function(sql){
    const mysql = require('mysql');
    /**
     * 创建mysql连接池
     */
    const pool = mysql.createPool({
        host     : config.host,
        user     : config.user,
        password : config.password,
        database : config.dbName
    });
    return await new Promise((resolve, reject) => {
        /**
         * 从连接池创建连接
         */
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, (err, data) => {
                    /**
                     * 查询结束，释放连接
                     */
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    });
}

/**
 * 连接Redis数据库，暴露操作对象
 */
const redis = require('redis');
const client = redis.createClient();
// client.auth(config.password, () => {});
client.on('error', (err) => {
    console.log('redis数据库连接出错：\n' + err);
});
client.on('connect', () => {
    console.log('redis数据库连接成功');
});
const MyRedis = require('../model/redis');
const myredis = new MyRedis(client);

/**
 * 暴露
 */
module.exports = {
    mysqlQuery,
    myredis
};