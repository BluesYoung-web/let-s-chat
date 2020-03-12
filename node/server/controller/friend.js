/**
 * 好友模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 引入mysql数据库查询方法
 */
const {mysqlQuery} = require('../database/conn');


/**
 * 引入操作MongoDB的类
 */
const MyMongo = require('../model/mongodb');

/**
 * 根据uid获取用户信息
 * @param {number} uid 当前用户信息
 * @param {number} fid 目标用户信息
 */
const get_info = function(uid, fid){
    let sql = `select * from user where uid = ${fid}`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            let user = data[0];
            get_list(uid).then((dt) => {
                if (dt.includes(fid)) {
                    user.isF = 1;
                } else {
                    user.isF = 0;
                }
                get_focus_list(uid).then((dt) => {
                    if (dt.includes(fid)) {
                        user.isFocus = 1;
                    } else {
                        user.isFocus = 0;
                    }
                    resolve(user);
                }).catch((err) => {
                    reject(err);
                });
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

const friend_list = new MyMongo({
    cname: 'friend',
    struct: {
        uid: Number,
        friendsList: Array
    }
});
/**
 * 根据uid获取好友列表
 * @param {number} uid 
 */
const get_list = function(uid){
    return new Promise((resolve, reject) => {
        friend_list.find({
            uid
        }).then((data) => {
            resolve(data[0].friendsList);
        }).catch((err) => {
            reject(err);
        });
    });
}
const focus_list = new MyMongo({
    cname: 'focus',
    struct: {
        uid: Number,
        focusList: Array
    }
});
/**
 * 根据uid获取关注列表
 * @param {number} uid 
 */
const get_focus_list = function(uid){
    return new Promise((resolve, reject) => {
        focus_list.find({
            uid
        }).then((data) => {
            resolve(data[0].focusList);
        }).catch((err) => {
            reject(err);
        });
    });
}
module.exports = {
    get_info,
    get_list,
    get_focus_list
}