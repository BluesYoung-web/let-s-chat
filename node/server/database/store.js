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
                        if (data.length != 0) {
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
}

module.exports = Store;