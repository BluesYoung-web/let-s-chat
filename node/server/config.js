/**
 * 配置文件
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

const os=require("os");

let networkInterfaces=os.networkInterfaces();

let ipAddress = networkInterfaces.WLAN[1].address;

module.exports = {
    dbName: 'lailiao',
    host: 'localhost',
    user: 'root',
    password: '123456',
    key: 'www.bluesyoung-web.com',
    ipAddress,
    // ipAddress: '117.78.0.214',
    httpPort: 80,
    wsPort: 8080
}