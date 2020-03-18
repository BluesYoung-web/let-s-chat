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
 * 获取我发表的
 * @param {number} uid 用户uid
 */
const get_release  = function(uid){
    let sql = `select * from finds where user_id = ${uid};`
    return sqlPro(sql);
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
 * 评论数据
 * @param {object} data 
 */
const comment = function(data){
    let sql = '';
    if (data.toUserId) {
        sql = `insert into comments(findId, userId, toUserId, content) 
        values(${data.findId}, ${data.uid}, ${data.toUserId}, '${data.content}');`;
    } else {
        sql = `insert into comments(findId, userId, content) 
        values(${data.findId}, ${data.uid}, '${data.content}');`;
    }
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then(() => {
            let s = `select * from comments where findId = ${findId};`;
            mysqlQuery(s).then((data) => {
                let len = data.length;
                let s2 = `update finds set commentsNum = ${len} where id = ${findId};`;
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
module.exports = {
    get_release,
    get,
    put_up,
    click_like,
    click_dis_like,
    comment,
    get_likes_list
}