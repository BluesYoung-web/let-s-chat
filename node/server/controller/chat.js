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

module.exports = {
    create_chat_room
}