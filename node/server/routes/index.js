/**
 * 根目录路由
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

const express = require('express');

const router = express.Router();

router.get('/:id', (req, res) => {
    res.send('<h1>来了老弟</h1>'+req.params.id)
});

/**
 * 暴露
 */
module.exports = router;