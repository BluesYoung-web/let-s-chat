/**
 * websocket服务器模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 引入websocket模块
 */
const ws = require('nodejs-websocket');
const Socket = require('./model/socket');
/**
 * websocket连接参数分离
 */
const {paramsSeparate} = require('./core/tools');
const {resFormat, pushFormat} = require('./core/tools');

/**
 * 创建websocket服务器
 */
let websocketServer = ws.createServer((conn) => {
    let {sign, uid} = {...paramsSeparate(conn.path)};
    /**
     * 连接建立之后立即验证token
     */
    tokenCheck(sign, uid, conn);
});

/**
 * token验证专用
 * @param {string} sign 签名
 * @param {number} uid 用户uid 
 * @param {object} conn socket连接对象
 */
const tokenCheck = function(sign, uid, conn){
    const {myredis} = require('./database/conn');
    const md5 = require('md5');
    myredis.get(uid + '_token').then((data) => {
        let token = data;
        if (md5(uid + token) == sign) {
            // 验证成功
            let socket = new Socket(uid, conn, websocketServer);
            // 清空离线消息队列
            socket.offLineSend();
            conn.on('text', (str) => {
                str = JSON.parse(str);
                socket.msgProcess(str);
            });
            conn.on('close', (code, reason) => {
                console.log('socket服务器关闭:\n' + code + reason);
            });
            conn.on('error', (code, reason) => {
                console.log('服务器异常关闭:\n' + code + reason);
            });
            let str = resFormat({
                status: 0,
                data: {
                    msg: 'token验证成功'
                }
            });
            console.log('token 验证成功');
            conn.sendText(str);
            // 挤号
            let onlines = getOnlines(websocketServer);
            for (const iterator of onlines) {
                if (iterator.uid == uid && iterator.key != socket.conn.key) {
                    iterator.sendText(pushFormat({
                        model: 100,
                        type: 0,
                        id: 4000,
                        data: {
                            tips: '账号异地登录，请重新登陆'
                        }
                    }));
                }
            }
        } else {
            conn.sendText(pushFormat({
                model: 100,
                type: 0,
                id: 4003,
                data: {
                    tips: 'token验证失败'
                }
            }));
            console.log('token 验证失败');
        }
    });
}

/**
 * 获取在线用户，后期用于挤号
 */
const getOnlines = function(server){
    let connections = server.connections;
    const onlines = [];
    for (let i of connections) {
        let {uid} = paramsSeparate(i.path);
        i.uid = uid;
        onlines.push(i);
    }
    return onlines;
}

module.exports = websocketServer;