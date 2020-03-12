/**
 * 管理后端数据存储
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

class Store{
    /**
     * 当前用户uid
     * @param {number} uid 
     */
    constructor(uid){
        this.uid = uid;
    }
    /**
     * 获取当前用户信息
     */
    get_info(){
        const {myredis} = require('../database/conn');
        const user = require('../controller/user');
        return new Promise((resolve, reject) => {
            // 首先从redis缓存获取
            myredis.get(`${this.uid}.info`).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    resolve({
                        data,
                        extra: {
                            source: 'redis缓存'
                        }
                    });
                } else {
                    // 没有缓存，从mysql数据库获取
                    user.get_info(this.uid).then((data) => {
                        if (data) {
                            // 更新缓存
                            myredis.set(`${this.uid}.info`, JSON.stringify(data)).then(() => {
                                // 返回数据
                                resolve({
                                    data,
                                    extra: {
                                        source: 'mysql'
                                    }
                                });
                            });
                        } else {
                            reject('查无此人');
                        }
                    }).catch((err) => {
                        reject('查询出错');
                    });
                }
            });
        });
    }
    /**
     * 设置当前用户信息
     */
    set_info(data){
        const {myredis} = require('../database/conn');
        const user = require('../controller/user');
        return new Promise((resolve, reject) => {
            // 先写入mysql数据库
            user.set_info(data).then((msg) => {
                // 更新缓存
                myredis.set(`${data.uid}.info`, JSON.stringify(data)).then(() => {
                    resolve(msg);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * 模糊搜索
     * @param {object} data 
     * @param {string} data.key 搜索关键字
     */
    search(key){
        const {myredis} = require('../database/conn');
        const user = require('../controller/user');
        return new Promise((resolve, reject) => {
            // 先从redis获取
            myredis.get(key).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    resolve({
                        data,
                        extra: {
                            source: 'redis缓存'
                        }
                    });
                } else {
                    user.search(key).then((data) => {
                        if (data.length != 0) {
                            myredis.set(key, JSON.stringify(data)).then(() => {
                                resolve({
                                    data,
                                    extra: {
                                        source: 'mysql'
                                    }
                                });
                            });
                        } else {
                            reject('查无此人');
                        }
                    }).catch((err) => {
                        reject('查询出错');
                    });
                }
            });
        });
    }
    /**
     * 根据uid获取用户信息
     * @param {number} uid 
     */
    get_user_info_by_uid(uid){
        const {myredis} = require('../database/conn');
        const friend = require('../controller/friend');
        return new Promise((resolve, reject) => {
            // 先从redis缓存获取
            myredis.get(`${uid}.info`).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    resolve({
                        data,
                        extra: {
                            source: 'redis缓存'
                        }
                    });
                } else {
                    friend.get_info(this.uid, uid).then((data) => {
                        if (data) {
                            myredis.set(`${uid}.info`, JSON.stringify(data)).then(() => {
                                resolve({
                                    data,
                                    extra: {
                                        source: 'mysql'
                                    }
                                });
                            });
                        } else {
                            reject('查无此人')
                        }
                    }).catch((err) => {
                        reject('查询出错');
                    });
                }
            });
        });
    }
    /**
     * 获取当前用户好友列表
     */
    get_friend_list(){
        const {myredis} = require('../database/conn');
        const friend = require('../controller/friend');
        return new Promise((resolve, reject) => {
            myredis.get(`${this.uid}.friend_list`).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    resolve({
                        data,
                        extra: 'redis缓存'
                    });
                } else {
                    friend.get_list(this.uid).then((data) => {
                        myredis.set(`${this.uid}.friend_list`, JSON.stringify(data)).then(() => {
                            resolve({
                                data,
                                extra: 'mysql'
                            });
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                }
            })
        });
    }
    /**
     * 加好友
     * @param {number} uid 好友uid
     */
    add_friend(uid){
        const {myredis} = require('../database/conn');
        const friend = require('../controller/friend');
        friend
    }
    /**
     * 删好友
     * @param {number} uid 好友uid
     */
    del_friend(uid){

    }
}

module.exports = Store;