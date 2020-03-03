/**
 * 服务端 
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 引入HTTP模块
 */
const httpServer = require('./server/httpServer');
httpServer.listen(80, () => {
    console.log('HTTP服务器运行中......')
});
/**
 * 引入websocket模块
 */
const websocketServer = require('./server/websocketServer');
websocketServer.listen(8080, () => {
    console.log('websocket服务器运行中.......')
});