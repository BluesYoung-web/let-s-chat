/**
 * http服务器模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 使用express框架
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const app = express();

/**
 * 创建日志写入流
 */
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log' ,'access.log'), { flags: 'a' });

/**
 * 引入子路由模块
 */
const index = require('./routes/index');
const login = require('./routes/login');
const upload = require('./routes/upload');

/**
 * 日志模块...
 */
app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/**
 * 托管静态文件，顺序执行，优先级高
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 模板页面
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
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
 * 404
 */
app.use(function(req, res, next) {
    next(createError(404));
});
/**
 * 错误显示
 */
app.use(function(err, req, res, next) {
    // 仅开发模式显示
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // 渲染错误页面
    res.status(err.status || 500);
    res.render('error');
});
/**
 * 暴露
 */
module.exports = app;
