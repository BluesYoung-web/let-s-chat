/**
 * 好友圈模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

const {mysqlQuery} = require('../database/conn');

const sqlPro = function(sql){
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * 获取我发表的所有好友圈(仅用于显示数量)
 * @param {number} uid 用户uid
 */
const get_release  = function(uid){
    let sql = `select * from finds where userId = ${uid};`
    return sqlPro(sql);
}

/**
 * 获取我发表的所有好友圈(拥有删除权限及分页懒加载)
 * @param {number} uid 用户uid
 * @param {number} page 分页
 */
const get_my_release = function(uid, page){
    const friend = require('./friend');
    const pagesize = 10;
    let start = (page - 1)*pagesize;
    return new Promise((resolve, reject) => {
        friend.get_focus_list(uid).then((data) => {
            data.push(uid);
            let str = '';
            str = `(${data.join(', ')})`;
            let sql = `SELECT finds.id, finds.userId, user.avatar, user.nick, finds.say, finds.ot, 
            finds.img, finds.commentsNum, finds.likesNum from finds,user 
            where finds.userId = ${uid} and finds.userId = user.uid ORDER BY finds.id desc`;
            mysqlQuery(sql).then((data) => {
                const all = data.length;
                const pagecount = Math.ceil(all / pagesize);
                let sql2 = `${sql} limit ${start}, ${pagesize};`;
                mysqlQuery(sql2).then((data) => {
                    let s = `select findId from likes where userId = ${uid};`;
                    let temp = data;
                    mysqlQuery(s).then((data) => {
                        let arr = []
                        for (const item of data) {
                            arr.push(item.findId);
                        }
                        for (const item of temp) {
                            if (arr.includes(item.id)) {
                                item.likeAction = 1;
                            } else {
                                item.likeAction = 0;
                            }
                        }
                        data = {
                            data: temp,
                            pagecount
                        }
                        resolve(data);
                    });
                });
            });
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
            let sql = `SELECT finds.id, finds.userId, user.avatar, user.nick, finds.say, finds.ot, 
            finds.img, finds.commentsNum, finds.likesNum from finds,user 
            where finds.userId in ${str} and finds.userId = user.uid
            ORDER BY finds.id desc`;
            mysqlQuery(sql).then((data) => {
                const all = data.length;
                const pagecount = Math.ceil(all / pagesize);
                let sql2 = `${sql} limit ${start}, ${pagesize};`;
                mysqlQuery(sql2).then((data) => {
                    let s = `select findId from likes where userId = ${uid};`;
                    let temp = data;
                    mysqlQuery(s).then((data) => {
                        let arr = []
                        for (const item of data) {
                            arr.push(item.findId);
                        }
                        for (const item of temp) {
                            if (arr.includes(item.id)) {
                                item.likeAction = 1;
                            } else {
                                item.likeAction = 0;
                            }
                        }
                        data = {
                            data: temp,
                            pagecount
                        }
                        resolve(data);
                    });
                });
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * 发布好友圈
 * @param {number} uid 用户uid
 * @param {object} data 好友圈数据
 * @param {number} data.ot 时间戳
 * @param {string} data.img 图片url
 * @param {string} data.say 标题（感想）
 */
const put_up = function (uid, data) {
    let sql = `insert into finds(userId, ot, img, say) 
    values(${uid}, '${data.ot}', '${data.img}', '${data.say}');`;
    return sqlPro(sql);
}

/**
 * 点赞
 * @param {number} uid 用户uid
 * @param {number} findId 好友圈id
 */
const click_like = function(uid, findId){
    let sql = `insert into likes(userId, findId, likeAction) values(${uid}, ${findId}, 1);`;
    return new Promise((resolve, reject) => {
        sqlPro(sql).then(() => {
            let s1 = `select * from likes where findId = ${findId};`;
            mysqlQuery(s1).then((data) => {
                let len = data.length;
                let s2 = `update finds set likesNum = ${len} where id = ${findId};`;
                sqlPro(s2).then(() => {
                    resolve();
                });
            });
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 取消点赞
 * @param {number} uid 用户uid
 * @param {number} findId 好友圈id
 */
const click_dis_like = function(uid, findId){
    let sql = `delete from likes where userId = ${uid} and findId = ${findId};`;
    return new Promise((resolve, reject) => {
        sqlPro(sql).then(() => {
            let s1 = `select * from likes where findId = ${findId};`;
            mysqlQuery(s1).then((data) => {
                let len = data.length;
                let s2 = `update finds set likesNum = ${len} where id = ${findId};`;
                sqlPro(s2).then(() => {
                    resolve();
                });
            });
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 发表评论
 * @param {number} uid 评论者uid
 * @param {object} data 评论数据
 */
const comment = function(uid, data){
    let sql = `insert into comments(findId, userId, toNick, content) 
        values(${data.findId}, ${uid}, ${data.toNick}, '${data.content}');`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then(() => {
            let s = `select * from comments where findId = ${data.findId};`;
            mysqlQuery(s).then((dt) => {
                let len = dt.length;
                let s2 = `update finds set commentsNum = ${len} where id = ${data.findId};`;
                sqlPro(s2).then(() => {
                    resolve();
                });
            });
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 获取点赞列表
 * @param {number} uid 用户uid
 * @param {number} findId 好友圈id
 */
const get_likes_list = function(findId){
    let sql = `select userId from likes where findId = ${findId};`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            let arr = [];
            for (const iterator of data) {
                arr.push(iterator.userId);
            }
            resolve(arr);
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 获取评论列表
 * @param {number} uid 用户uid
 * @param {number} findId 好友圈id
 */
const get_comments_list = function(findId){
    let sql = `SELECT comments.id, user.uid, user.avatar, user.nick, comments.content, comments.toNick from 
    user, comments where comments.findId = ${findId} and user.uid = comments.userId;`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}
module.exports = {
    get_release,
    get,
    put_up,
    click_like,
    click_dis_like,
    comment,
    get_likes_list,
    get_comments_list,
    get_my_release
}