/**
 * 服务端 
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

 /**
  * 引入HTTP模块
  */
const http = require('http');
/**
 * 引入url解析模块
 */
const url = require('url');
/**
 * 引入websocket模块
 */
const ws = require('nodejs-websocket');

// http.createServer((req, res) => {
//     res.writeHead(200, {
//         'Content-Type': 'text/html'
//     });
//     res.end('hello word');
//     let params = url.parse(req.url);
//     console.log(params);
// }).listen(8080);

let server = ws.createServer((conn) => {
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
}).listen(8848);

console.log("WebSocket建立完毕");