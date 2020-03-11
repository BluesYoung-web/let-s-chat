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
const {resFormat} = require('./core/tools');

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
            conn.on('text', (str) =>{
                str = JSON.parse(str);
                let socket = new Socket(uid, conn, websocketServer);
                socket.msgProcess(str);
            });
            conn.on('close', (reason) => {
                console.log('socket服务器关闭'+reason);
            });
            conn.on('error', (reason) => {
                console.log('服务器异常关闭'+reason);
            });
            let str = resFormat({
                status: 0,
                data: {
                    msg: 'token验证成功'
                }
            });
            conn.sendText(str);
        } else {
            // 验证失败
            let str = resFormat({
                status: -1,
                data: {
                    msg: 'token验证失败'
                }
            });
            conn.sendText(str);
            setTimeout(() => {
                conn.close();
            }, 1000);
        }
    })
}


module.exports = websocketServer;