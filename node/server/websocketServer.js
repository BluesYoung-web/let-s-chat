/**
 * websocket服务器模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 引入websocket模块
 */
const ws = require('nodejs-websocket');

let websocketServer = ws.createServer((conn) => {
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
    console.log(conn.path);
});

module.exports = websocketServer;