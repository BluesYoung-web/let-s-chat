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

/**
 * 根据uid获取好友列表
 * @param {number} uid 
 */
const get_list = function(uid){
    return new Promise((resolve, reject) => {
        let sql = `select fid from friends where uid = ${uid};`;
        mysqlQuery(sql).then((data) => {
            let arr = [];
            for (const key in data) {
                arr.push(data[key].fid);
            }
            resolve(arr);
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 根据uid获取关注列表
 * @param {number} uid 
 */
const get_focus_list = function(uid){
    return new Promise((resolve, reject) => {
        let sql = `select fid from focus where uid = ${uid};`;
        mysqlQuery(sql).then((data) => {
            let arr = [];
            for (const key in data) {
                arr.push(data[key].fid);
            }
            resolve(arr);
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 加好友
 * @param {number} uid 用户uid
 * @param {number} fid 好友uid
 */
const add = function(uid, fid){
    // 加好友的同时，默认互相关注
    let sql = `insert into friends(uid, fid) values(${uid}, ${fid}),(${fid}, ${uid});`;
    let sql2 = `insert into focus(uid, fid) values(${uid}, ${fid}),(${fid}, ${uid});`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            mysqlQuery(sql2).then((data) => {
                get_list(uid).then((data) => {
                    resolve(data);
                });
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * 删好友
 * @param {number} uid 用户uid
 * @param {number} fid 好友uid
 */
const del = function(uid, fid){
    // 删好友的同时，默认取关
    let sql = `delete from friends where (uid = ${uid} and fid = ${fid}) or (uid = ${fid} and fid = ${uid});`;
    let sql2 = `delete from focus where (uid = ${uid} and fid = ${fid}) or (uid = ${fid} and fid = ${uid});`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            mysqlQuery(sql2).then((data) => {
                get_list(uid).then((data) => {
                    resolve(data);
                });
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * 关注
 * @param {number} uid 用户uid
 * @param {number} fid 好友uid
 */
const focus = function(uid, fid){
    let sql = `insert into focus(uid, fid) values(${uid}, ${fid});`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) =>{
            resolve(data);
        }).catch((err) =>{
            reject(err);
        });
    });
}
/**
 * 取关
 * @param {number} uid 用户uid
 * @param {number} fid 好友uid
 */
const dis_focus = function(uid, fid){
    let sql = `delete from focus where uid = ${uid} and fid = ${fid};`;
    return new Promise((resolve, reject) =>{
        mysqlQuery(sql).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * 获取关注我的人
 * @param {number} uid 用户uid
 */
const get_follows = function(uid){
    let sql = `select uid from focus where fid = ${uid};`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            let arr = [];
            for (const iterator of data) {
                arr.push(iterator.uid);
            }
            resolve(arr);
        }).catch((err) => {
            resolve(err);
        });
    });
}

module.exports = {
    get_info,
    get_list,
    get_focus_list,
    add,
    del,
    focus,
    dis_focus,
    get_follows,
}