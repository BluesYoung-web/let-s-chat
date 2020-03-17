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

/**
 * 获取我能看到的所有好友圈
 * @param {number} uid 用户uid
 * @param {number} page 分页
 */
const get = function(uid, page){
    const friend = require('./friend');
    const pagesize = 10;
    let start = (page - 1)*pagesize;
    return new Promise((resolve, reject) => {
        friend.get_focus_list(uid).then((data) => {
            data.push(uid);
            let str = '';
            str = `(${data.join(', ')})`;
            let sql = `SELECT finds.id id, finds.userId userId, user.avatar avatar, 
            user.nick nick, finds.say say, finds.ot ot, 
            finds.img img, finds.commentsNum commentsNum, finds.likesNum likesNum
            from finds,user where finds.userId in ${str} and finds.userId = user.uid
            ORDER BY finds.id desc`;
            mysqlQuery(sql).then((data) => {
                const all = data.length;
                const pagecount = Math.ceil(all / pagesize);
                let sql2 = `${sql} limit ${start}, ${pagesize};`;
                mysqlQuery(sql2).then((data) => {
                    data = {
                        data,
                        pagecount
                    }
                    resolve(data);
                });
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    get_release,
    get
}