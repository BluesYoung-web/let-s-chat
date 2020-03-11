/**
 * 用户模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 引入mysql数据库查询方法
 */
const {mysqlQuery} = require('../database/conn');

/**
 * 引入操作redis的对象
 */
const {myredis} = require('../database/conn');
/**
 * 制作token的函数
 */
const makeToken = function(){
    const md5 = require('md5');
    const sha1 = require('sha1');
    const {key} = require('../config');
    return md5(key + sha1(Date.parse(new Date())));
}
/**
 * 用户登录
 * @param {string} tel 用户手机号
 * @param {string} wxid 用户微信id
 */
const login = function(tel, wxid){
    let search;
    if (tel != '') {
        search = `select * from user where tel = ${tel};`;
    } else if (wxid != ''){
        search = `select * from user where wxid = '${wxid}';`;
    }
    let combin = `update user set wxid = '${wxid}' where tel = ${tel};`;
    let wxReg = `insert into user(tel,wxid) values(${tel},'${wxid}');`;
    let telReg = `insert into user(tel) values(${tel});`
    const {respondProcess} = require('../core/tools');
    let token = makeToken();
    return new Promise((resolve, reject) => {
        mysqlQuery(search).then((data) => {
            if (data.length != 0) {
                // 如果是老用户
                if (tel && wxid != '') {
                    // 首次使用微信登录，绑定手机号，合并现有账号
                    mysqlQuery(combin).then((dt) => {
                        mysqlQuery(search).then((data) => {
                            data = data.pop();
                            data.token = token;
                            let tp = {
                                bnew: 0,
                                user: data
                            }
                            // 存储token
                            myredis.set(data.uid + '_token', token);
                            resolve(respondProcess(0, tp, '合并现有账号成功'));
                        });
                    });
                } else {
                    data = data.pop();
                    data.token = token;
                    let tp = {
                        bnew: 0,
                        user: data
                    }
                    // 存储token
                    myredis.set(data.uid + '_token', token);
                    resolve(respondProcess(0, tp, '用户登录成功'));
                }
            } else {
                // 新用户
                if (tel && wxid) {
                    // 新用户使用微信登录
                    mysqlQuery(wxReg).then((dt) => {
                        mysqlQuery(search).then((data) => {
                            data = data.pop();
                            data.token = token;
                            let tp = {
                                bnew: 1,
                                user: data
                            }
                            // 存储token
                            myredis.set(data.uid + '_token', token);
                            resolve(respondProcess(0, tp, '微信注册成功'));
                        });
                    });
                } else if(tel) {
                    // 新用户使用手机号登录
                    mysqlQuery(telReg).then((dt) => {
                        mysqlQuery(search).then((data) => {
                            data = data.pop();
                            data.token = token;
                            let tp = {
                                bnew: 1,
                                user: data
                            }
                            // 存储token
                            myredis.set(data.uid + '_token', token);
                            resolve(respondProcess(0, tp, '手机号注册成功'));
                        });
                    });
                } else {
                    resolve(respondProcess(-1, {}, '未绑定手机号'));
                }
            }
        });
    });
}

/**
 * 根据uid获取用户信息
 */
const get_info = function(uid) {
    let sql = `select * from user where uid = ${uid}`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            resolve(data[0]);
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 设置用户信息
 * @param {object} args 
 * @param {number} args.uid 用户uid
 * @param {string} args.avatar 用户头像
 * @param {string} args.nick 用户昵称 
 * @param {string} args.motto 用户个性签名 
 * @param {number} args.tel 用户手机号
 */
const set_info = function(args){
    let {uid, avatar, nick, motto, tel} = {...args};
    let sql = `update user set nick = '${nick}', motto = '${motto}', avatar = '${avatar}', tel = ${tel}
                where uid = ${uid};`
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then(() => {
            resolve('修改成功');
        }).catch((err) => {
            reject('修改失败');
        });
    });
}

/**
 * 模糊查询
 */
const search = function(key){
    let sql;
    if (isNaN(key)) {
        // 昵称
        sql = `select * from user where nick like '%${key}%';`;
    } else {
        // uid或tel
        sql = `select * from user where uid = ${key} or tel = ${key};`;
    }
    console.log(sql);
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 暴露
 */
module.exports = {
    login,
    get_info,
    set_info,
    search
}