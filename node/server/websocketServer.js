/**
 * websocket服务器模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 引入websocket模块
 */
const ws = require('nodejs-websocket');
/**
 * websocket连接参数分离
 */
const {paramsSeparate} = require('./core/tools');

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
            conn.sendText('token验证成功');
        } else {
            // 验证失败
            conn.sendText('token验证失败');
            setTimeout(() => {
                conn.close();
            }, 1000);
        }
    })
}

let websocketServer = ws.createServer((conn) => {
    let {sign, uid} = {...paramsSeparate(conn.path)};
    tokenCheck(sign, uid, conn);
    conn.on('text', (str) =>{
        console.log('msg:'+str);
        conn.sendText(str);
    });
    conn.on('close', (code, reason) => {
        console.log('socket服务器关闭'+reason);
    });
    conn.on('error', (code, reason) => {
        console.log('服务器异常关闭'+reason);
    });
});

module.exports = websocketServer;