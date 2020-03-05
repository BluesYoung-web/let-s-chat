/**
 * 登录接口路由
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

const express = require('express');

const router = express.Router();

const {login} = require('../controller/user');

router.get('/', (req, res) => {
    // res.send('<h1>登陆路由</h1>');
    res.setHeader('Access-Control-Allow-Origin', '*');

    login(15171255945, '').then((data) => {
        res.send(data);
    });
});

router.post('/', (req, res) => {
    let tel = req.body.tel || '';
    let wxid = req.body.wxid || '';
    // 设置跨域响应头
    res.setHeader('Access-Control-Allow-Origin', '*');
    login(tel, wxid).then((data) => {
        res.send(data);
    });
});


/**
 * 暴露
 */
module.exports = router;