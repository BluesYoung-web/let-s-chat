/**
 * 服务端 
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 引入配置文件
 */
const {httpPort, wsPort} = require('./server/config');
/**
 * 引入HTTP模块
 */
const httpServer = require('./server/httpServer');
httpServer.listen(httpPort, () => {
    console.log('HTTP服务器运行中......')
});
/**
 * 引入websocket模块
 */
const websocketServer = require('./server/websocketServer');
websocketServer.listen(wsPort, () => {
    console.log('websocket服务器运行中.......')
});