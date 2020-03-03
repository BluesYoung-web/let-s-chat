/**
 * http服务器模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 使用express框架
 */
const express = require('express');
const app = express();
const path = require('path');

/**
 * 引入日志模块
 */
const log = require('./log/log');

/**
 * 引入子路由模块
 */
const index = require('./routes/index');
const login = require('./routes/login');
const upload = require('./routes/upload');

/**
 * 日志模块
 */
app.use(log);

/**
 * 托管静态文件，顺序执行，优先级高
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 根目录路由
 */
app.use('/', index);

/**
 * 登录接口
 */
app.use('/login', login);

/**
 * 文件上传接口
 */
app.use('/upload', upload);
/**
 * 暴露
 */
module.exports = app;