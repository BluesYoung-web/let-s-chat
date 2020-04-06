/**
 * 聊天模块
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
 * 创建聊天室
 * @param {object} args
 * @param {number} args.type 0-私聊 1-群聊
 * @param {string} args.title 群聊名称
 * @param {Array} args.users 聊天室用户的uid列表
 */
const create_chat_room = function(args){
    let {type, title, users} = {...args};
    title = title ? title : null;
    let regtime = Date.parse(new Date());
    let sql = `insert into chat_room(type, title, regtime) values(${type}, '${title}', '${regtime}');`;
    let sql1 = `select id from chat_room where regtime = '${regtime}';`;
    let sql2 = `insert into chat_room_users(chatRoomId, uid)`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then(() => {
            mysqlQuery(sql1).then((data) => {
                let id = data[0].id;
                let values = '';
                for (const iterator of users) {
                   values += `(${id}, ${iterator}),`;
                }
                values = values.split('');
                values.pop();
                values = values.join('');
                let sql4 = `${sql2} values${values};`;
                mysqlQuery(sql4).then(() => {
                    users = users.map((item) => Number(item));
                    resolve({
                        roomId: id,
                        users
                    });
                }); 
            });
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 删除聊天室
 * @param {number} roomId 
 */
const del_chat_room = function(roomId) {
    let sql = `delete from chat_room where id = ${roomId};`;
    let sql2 = `delete from chat_room_users where chatRoomId = ${roomId};`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then(() => {
            mysqlQuery(sql2).then((data) => {
                resolve(data);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 根据房间id获取房间详细信息
 * @param {number} roomId 
 */
const get_room_info = function(roomId){
    let sql = `select * from chat_room where id = ${roomId};`;
    let sql2 = `select uid from chat_room_users where chatRoomId = ${roomId};`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            let roomInfo = data[0];
            mysqlQuery(sql2).then((dt) => {
                let users = [];
                for (const iterator of dt) {
                    users.push(iterator.uid);
                }
                roomInfo.users = users;
                resolve(roomInfo);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 根据成员uid列表获取房间id
 * @param {Array} uidList 
 */
const get_room_id_by_users = function(uidList){
    let len = uidList.length;
    let str = uidList.join(', ');
    str = `(${str})`;
    let sql = `select chatRoomId from chat_room_users where uid in ${str} 
                group by chatRoomId having count(distinct uid) = ${len}`;
    return new Promise((resolve, reject) => {
        mysqlQuery(sql).then((data) => {
            resolve(data[0].chatRoomId);
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 拉人进群(未加验证)
 * @param {object} args
 * @param {number} args.roomId 聊天室id
 * @param {Array} args.users 被邀请人的列表
 */
const invite_into_chat_room = function(args){
    let {roomId, users} = {...args};
    let sql = `insert into chat_room_users(chatRoomId, uid)`;
    return new Promise((resolve, reject) => {
        let values = '';
        for (const iterator of users) {
            values += `(${roomId}, ${iterator}),`;
        }
        values = values.split('');
        values.pop();
        values = values.join('');
        let sql2 = `${sql} values${values};`;
        mysqlQuery(sql2).then((data) => {
            resolve(data);
        }).catch((err) => {
            resolve(err);
        });
    });
}
/**
 * 退群
 */
const quit_from_chat_room = function(uid, roomId){
    let sql = `delete from chat_room_users where uid = ${uid} and chatRoomId = ${roomId};`;
    return sqlPro(sql);
}

module.exports = {
    create_chat_room,
    get_room_info,
    get_room_id_by_users,
    del_chat_room,
    invite_into_chat_room,
    quit_from_chat_room,
}