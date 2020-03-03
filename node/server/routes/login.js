/**
 * 登录接口路由
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('<h1>登陆路由</h1>')
});

router.post('/', (req, res) => {

});

/**
 * 暴露
 */
module.exports = router;