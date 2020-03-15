/**
 * 好友圈模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

const {mysqlQuery} = require('../database/conn');
/**
 * 获取我发表的
 * @param {number} uid 用户uid
 */
const get_release  = function(uid){
    let sql = `select * from finds where user_id = ${uid};`
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    get_release
}