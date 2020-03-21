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
     * redis add
     * @param {number} uid 用户uid
     * @param {number} fid 好友uid
     * @param {string} list 列表名称
     */
    add(uid, fid, list){
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) => {
            myredis.get(`${uid}.${list}`).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    data.push(fid);
                    myredis.set(`${uid}.${list}`, JSON.stringify(data)).then(() => {
                        resolve();
                    });
                } else {
                    myredis.set(`${uid}.${list}`, JSON.stringify([fid])).then(() => {
                        resolve();
                    });
                }
            });
        });
    }
    /**
     * redis del
     * @param {number} uid 用户uid
     * @param {number} fid 好友uid
     * @param {string} list 列表名称
     */
    del(uid, fid, list){
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) => {
            myredis.get(`${uid}.${list}`).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    data.splice(data.indexOf(fid), 1);
                    myredis.set(`${uid}.${list}`, JSON.stringify(data)).then(() => {
                        resolve();
                    });
                } else {
                    myredis.set(`${uid}.${list}`, JSON.stringify([])).then(() => {
                        resolve();
                    });
                }
            });
        });
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
        const friend = require('../controller/friend');
        return new Promise((resolve, reject) => {
            friend.get_info(this.uid, uid).then((data) => {
                if (data) {
                    resolve({
                        data,
                        extra: {
                            source: 'mysql'
                        }
                    });
                } else {
                    reject('查无此人')
                }
            }).catch((err) => {
                reject('查询出错');
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
        return new Promise((resolve, reject) => {
            friend.add(this.uid, uid).then((data) => {
                // 添加成功之后更新缓存
                myredis.set(`${this.uid}.friend_list`, JSON.stringify(data)).then(() => {
                    myredis.set(`${uid}.friend_list`, JSON.stringify(data)).then(() => {
                        this.add(this.uid, uid, 'focus_list').then(() => {
                            this.add(uid, this.uid, 'focus_list').then(() => {
                                resolve({
                                    data,
                                    extra: '好友添加成功'
                                });
                            });
                        });
                    });
                });
            }).catch((err) => {
                reject({
                    data: '好友添加失败'
                });
            });
        });
    }
    /**
     * 删好友
     * @param {number} uid 好友uid
     */
    del_friend(uid){
        const friend = require('../controller/friend');
        // 先删缓存，再删库
        return new Promise((resolve, reject) => {
            this.del(this.uid, uid, 'friend_list').then(() => {
                this.del(uid, this.uid, 'friend_list').then(() => {
                    this.del(this.uid, uid, 'focus_list').then(() => {
                        this.del(uid, this.uid, 'focus_list').then(() => {
                            friend.del(this.uid, uid).then((data) => {
                                resolve({
                                    data,
                                    extra: '好友删除成功'
                                });
                            }).catch(() => {
                                reject({
                                    data: '好友删除失败'
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    /**
     * 关注
     * @param {number} uid 好友uid
     */
    focus(uid){
        const friend = require('../controller/friend');
        return new Promise((resolve, reject) => {
            friend.focus(this.uid, uid).then((data) => {
                this.add(this.uid, uid, 'focus_list').then(() => {
                    resolve({
                        data: '关注成功'
                    });
                });
            }).catch((err) => {
                reject({
                    data: err,
                    extra: '关注失败'
                });
            });
        });
    }
    /**
     * 取关
     * @param {number} uid 好友uid
     */
    dis_focus(uid){
        const friend = require('../controller/friend');
        return new Promise((resolve, reject) => {
            this.del(this.uid, uid, 'focus_list').then(() => {
                friend.dis_focus(this.uid, uid).then((data) => {
                    resolve({
                        data: '取关成功'
                    });
                });
            }).catch((err) => {
                reject({
                    data: err,
                    extra: '取关失败'
                });
            });
        });
    }
    /**
     * 获取关注我的人
     * @param {number} uid 用户uid
     */
    get_follows(uid){
        const friend = require('../controller/friend');
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) => {
            myredis.get(`${uid}.follows`).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    resolve({
                        data,
                        extra: 'redis缓存'
                    });
                } else {
                    friend.get_follows(uid).then((data) => {
                        myredis.set(`${uid}.follows`, JSON.stringify(data)).then(() => {
                            resolve({
                                data,
                                extra: 'mysql'
                            });
                        });
                    }).catch((err) => {
                        reject('查找出错');
                    });
                }
            });
        });
    }
    /**
     * 获取关注列表
     * @param {number} uid
     */
    get_focus_list(uid){
        const {myredis} = require('../database/conn');
        const friend = require('../controller/friend');
        return new Promise((resolve, reject) => {
            myredis.get(`${uid}.focus_list`).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    resolve({
                        data,
                        extra: 'redis缓存'
                    });
                } else {
                    friend.get_list(uid).then((data) => {
                        myredis.set(`${uid}.focus_list`, JSON.stringify(data)).then(() => {
                            resolve({
                                data,
                                extra: 'mysql'
                            });
                        });
                    }).catch((err) => {
                        reject('查找出错');
                    });
                }
            })
        });
    }
    /**
     * 获取我发表的(仅用于数量统计)
     * @param {number} uid 用户uid
     */
    get_release(uid){
        const find = require('../controller/find');
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) => {
            myredis.get(`${uid}.release`).then((data) => {
                data = JSON.parse(data);
                if (data.length != 0) {
                    resolve({
                        data,
                        extra: 'redis缓存'
                    });
                } else {
                    find.get_release(uid).then((data) =>{
                        myredis.set(`${uid}.release`, JSON.stringify(data)).then(() => {
                            resolve({
                                data,
                                extra: 'mysql'
                            });
                        });
                    });
                }
            }).catch((err) => {
                reject('查找出错');
            });
        });
    }
    /**
     * 获取我发表的好友圈
     * @param {number} page 分页
     */
    get_my_release(page){
        const find = require('../controller/find');
        return new Promise((resolve, reject) => {
            page = page > 0 ? page : 1;
            find.get_my_release(this.uid, page).then((data) => {
                resolve({
                    data
                });
            }).catch((err) => {
                reject('查找出错');
            });
        });
    }
    /**
     * 获取我能看到的好友圈
     * @param {number} page 分页
     */
    get_circle(page){
        const find = require('../controller/find');
        return new Promise((resolve, reject) => {
            page = page > 0 ? page : 1;
            find.get(this.uid, page).then((data) => {
                resolve({
                    data
                });
            }).catch((err) => {
                reject('查找出错');
            });
        });
    }
    /**
     * 发布好友圈
     * @param {object} data 
     */
    put_up(data){
        const find = require('../controller/find');
        return new Promise((resolve, reject) =>{
            find.put_up(this.uid, data).then((data) => {
                resolve({
                    data: '发布成功'
                });
            }).catch((err) => {
                reject('发布失败');
            });
        });
    }
    /**
     * 点赞
     * @param {number} findId 好友圈id
     */
    click_like(findId){
        const find = require('../controller/find');
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) => {
            find.click_like(this.uid, findId).then(() => {
                myredis.get(`${findId}.like_list`).then((data) => {
                    if (data) {
                        data = JSON.parse(data);
                    } else {
                        data = [];
                    }
                    data.push(this.uid);
                    myredis.set(`${findId}.like_list`, JSON.stringify(data)).then(() => {
                        resolve({
                            data: '点赞成功'
                        });
                    });
                });
            }).catch((err) => {
                reject('点赞失败');
            });
        });
    }
    /**
     * 取消点赞
     * @param {number} findId 好友圈id
     */
    click_dis_like(findId){
        const {myredis} = require('../database/conn');
        const find = require('../controller/find');
        return new Promise((resolve, reject) => {
            myredis.get(`${findId}.like_list`).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    data.splice(data.indexOf(this.uid), 1);
                    myredis.set(`${findId}.like_list`, JSON.stringify(data)).then(() => {
                        find.click_dis_like(this.uid, findId).then(() => {
                            resolve({
                                data: '取消点赞成功'
                            });
                        }).catch((err) => {
                            reject('取消点赞失败');
                        });
                    });
                } else {
                    myredis.set(`${findId}.like_list`, JSON.stringify([])).then(() => {
                        find.click_dis_like(this.uid, findId).then(() => {
                            resolve({
                                data: '取消点赞成功'
                            });
                        }).catch((err) => {
                            reject('取消点赞失败');
                        });
                    });
                }
            });
        });
    }
    /**
     * 发表评论
     */
    comment(data){
        const find = require('../controller/find');
        return new Promise((resolve, reject) => {
            find.comment(this.uid, data).then(() => {
                resolve({
                    data: '评论成功'
                });
            }).catch((err) => {
                reject('评论失败');
            });
        });
    }
    /**
     * 获取点赞列表
     */
    get_likes_list(findId){
        const {myredis} = require('../database/conn');
        const find = require('../controller/find');
        return new Promise((resolve, reject) => {
            myredis.get(`${findId}.like_list`).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    resolve({
                        data,
                        extra: 'redis缓存'
                    });
                } else {
                    find.get_likes_list(findId).then((data) => {
                        resolve({
                            data,
                            extra: 'mysql'
                        });
                    }).catch((err) => {
                        reject('查找出错');
                    });
                }
            })
        });
    }
    /**
     * 获取评论列表
     */
    get_comments_list(findId){
        const find = require('../controller/find');
        return new Promise((resolve, reject) => {
            find.get_comments_list(findId).then((data) => {
                resolve({
                    data,
                    extra: 'mysql'
                });
            }).catch((err) => {
                reject('查找出错');
            });
        });
    }
}

module.exports = Store;