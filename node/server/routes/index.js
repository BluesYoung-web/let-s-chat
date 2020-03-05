/**
 * 根目录路由
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

const express = require('express');

const router = express.Router();



router.get('/', (req, res) => {
    const {myredis} = require('../database/conn');
    myredis.set('奥利给', '大哥').then((data) => {
        myredis.get('奥利给').then((data) => {
            res.send(data);
        });
    });
});

/**
 * 暴露
 */
module.exports = router;