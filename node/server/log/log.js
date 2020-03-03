/**
 * 日志模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */
const fs = require('fs');

const log = function(req, res, next){
    console.log("我是写日志的中间件");
    let ip = req.ip;
    let time = new Date().toUTCString();
    let str = `访问时间${time},ip地址：${ip}\n`;
    let data;
    try {
        data = fs.readFileSync('./server/log/log.log');
        data += str;
        fs.writeFileSync('./server/log/log.log', data);
    } catch (error) {
        fs.writeFileSync('./server/log/log.log', str);
    }
    next();
}

module.exports = log;