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
                    myredis.del(`${uid}.${list}`).then(() => {
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
            myredis.get(`${this.uid}.userInfo`).then((data) => {
                data = JSON.parse(data);
                if (data) {
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
                            myredis.set(`${this.uid}.userInfo`, JSON.stringify(data)).then(() => {
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
            user.set_info(data).then(() => {
                // 更新缓存
                myredis.set(`${data.uid}.userInfo`, JSON.stringify(data)).then(() => {
                    resolve({
                        data: '修改成功'
                    });
                });
            }).catch((err) => {
                reject('修改失败');
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
            myredis.get(`search.${key}`).then((data) => {
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
                            myredis.set(`search.${key}`, JSON.stringify(data)).then(() => {
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
     * 加好友(真正调用)
     * @param {number} uid 好友uid
     */
    add_friend_pre(uid){
        const friend = require('../controller/friend');
        return new Promise((resolve, reject) => {
            friend.addPre(this.uid, uid).then(() => {
                resolve({
                    data: '好友申请已成功发送'
                });
            }).catch((err) => {
                reject('好友申请发送失败');
            });
        });
    }
    /**
     * 好友验证结果
     * @param {object} data 
     */
    friend_check(data){
        const friend = require('../controller/friend');
        return new Promise((resolve, reject) => {
            friend.check(data).then(() => {
                resolve({
                    data: '您已处理好友申请'
                });
            }).catch((err) => {
                reject('好友申请处理失败');
            });
        })
    }
    /**
     * 加好友
     * @param {number} uid 好友uid
     */
    add_friend(uid){
        const friend = require('../controller/friend');
        // 先更新库，再更新缓存
        return new Promise((resolve, reject) => {
            friend.add(this.uid, uid).then((data) => {
                this.add(this.uid, uid, 'friend_list').then(() => {
                    this.add(uid, this.uid, 'friend_list').then(() => {
                        this.add(this.uid, uid, 'focus_list').then(() => {
                            this.add(uid, this.uid, 'focus_list').then(() => {
                                this.add(this.uid, uid, 'follows').then(() => {
                                    this.add(uid, this.uid, 'follows').then(() => {
                                        resolve({
                                            data,
                                            extra: '好友添加成功'
                                        });
                                    });
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
                            this.del(this.uid, uid, 'follows').then(() => {
                                this.del(uid, this.uid, 'follows').then(() => {
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
                if (data) {
                    data = JSON.parse(data);
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
     * 删除我发表的好友圈
     * @param {number} findId 
     */
    del_my_release(findId){
        const find = require('../controller/find');
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) => {
            find.del(findId).then(() => {
                // 更新缓存
                find.get_release(this.uid).then((data) =>{
                    myredis.set(`${this.uid}.release`, JSON.stringify(data)).then(() => {
                        resolve({
                            data: '好友圈删除成功'
                        });
                    });
                });
            }).catch((err) =>{
                reject('好友圈删除失败');
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
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) =>{
            find.put_up(this.uid, data).then((data) => {
                // 更新缓存
                find.get_release(this.uid).then((data) =>{
                    myredis.set(`${this.uid}.release`, JSON.stringify(data)).then(() => {
                        resolve({
                            data: '好友圈发布成功'
                        });
                    });
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
    /**
     * 获取好友验证列表
     */
    get_check_list(){
        const friend = require('../controller/friend');
        return new Promise((resolve, reject) => {
            friend.get_check_list(this.uid).then((data) => {
                resolve({
                    data
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * 创建聊天室
     */
    create_chat_room(data){
        data.users && data.users.push(this.uid);
        const chat = require('../controller/chat');
        return new Promise((resolve, reject) => {
            chat.create_chat_room(data).then((data) => {
                resolve({
                    data
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * 删除聊天室
     * @param {number} roomId 聊天室id
     */
    del_chat_room(roomId){
        const chat = require('../controller/chat');
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) => {
            // 先删缓存再删库
            myredis.del(`${roomId}.roomInfo`).then(() => {
                chat.del_chat_room(roomId).then((data) => {
                    resolve({
                        data
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    /**
     * 获取聊天室详细信息
     */
    get_room_info(roomId){
        const chat = require('../controller/chat');
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) => {
            myredis.get(`${roomId}.roomInfo`).then((data) => {
                if (data) {
                    data = JSON.parse(data);
                    resolve({
                        data,
                        extra: {
                            source: 'redis缓存'
                        }
                    });
                } else {
                    chat.get_room_info(roomId).then((data) => {
                        myredis.set(`${roomId}.roomInfo`, JSON.stringify(data)).then(() => {
                            resolve({
                                data,
                                extra: {
                                    source: 'mysql'
                                }
                            });
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
        });
    }
    /**
     * 根据成员uid列表获取房间id
     * @param {Array} uidList 
     */
    get_room_id_by_users(uidList){
        uidList.push(this.uid);
        const chat = require('../controller/chat');
        return new Promise((resolve, reject) => {
            chat.get_room_id_by_users(uidList).then((data) => {
                resolve({
                    data
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * 拉人进聊天室
     */
    invite_into_chat_room(data){
        const {myredis} = require('../database/conn');
        const chat = require('../controller/chat');
        return new Promise((resolve, reject) => {
            chat.invite_into_chat_room(data).then((dt) => {
                // 更新聊天室信息缓存
                chat.get_room_info(data.roomId).then((tp) => {
                    myredis.set(`${data.roomId}.roomInfo`, JSON.stringify(tp)).then(() => {
                        resolve({
                            data: dt,
                            extra: {
                                tips: '已邀请'
                            }
                        });
                    });
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * 退出聊天室
     */
    quit_from_chat_room(roomId){
        const chat = require('../controller/chat');
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) => {
            chat.quit_from_chat_room(this.uid, roomId).then((dt) => {
                // 更新聊天室信息缓存
                chat.get_room_info(roomId).then((tp) => {
                    myredis.set(`${roomId}.roomInfo`, JSON.stringify(tp)).then(() => {
                        resolve({
                            data: dt,
                            extra: {
                                tips: '退出聊天室成功'
                            }
                        });
                    });
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * 设置聊天室信息
     */
    set_room_info(data){
        const chat = require('../controller/chat');
        const {myredis} = require('../database/conn');
        return new Promise((resolve, reject) => {
            chat.set_room_info(data).then((dt) => {
                // 更新聊天室信息缓存
                myredis.set(`${data.id}.roomInfo`, JSON.stringify(data)).then(() => {
                    resolve({
                        data: dt,
                        extra: {
                            tips: '聊天室信息修改成功'
                        }
                    });
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * 获取我加入的群聊
     */
    get_my_qun(){
        const chat = require('../controller/chat');
        return new Promise((resolve, reject) => {
            chat.get_my_qun(this.uid).then((dt) => {
                resolve({
                    data: dt
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = Store;