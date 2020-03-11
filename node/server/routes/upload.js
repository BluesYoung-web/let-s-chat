/**
 * 上传接口路由
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    res.send('<h1>上传路由</h1>')
});

router.post('/', multipartMiddleware, (req, res) => {
    // post参数位于req.body中
    let type = req.body.type;
    // 原始文件名
    let orgName = req.files[type].originalFilename;
    // 保存文件名
    let name = Date.parse(new Date()) + orgName;
    // 临时路径
    let tempPath = req.files[type].path;
    // 保存路径
    let savePath = path.join('./server/public', type, name);
    // 创建读取流
    let rs = fs.createReadStream(tempPath);
    // 创建写入流
    let ws = fs.createWriteStream(savePath);
    // 存储上传的文件
    rs.pipe(ws);
    // 删除临时文件
    fs.unlink(tempPath, () => {
        console.log('临时文件已删除');
    });
    const {ipAddress} = require('../config');
    let url = `http://${ipAddress}/${type}/${name}`;
    const {respondProcess} = require('../core/tools');
    res.send(respondProcess(0, {url}, '文件上传成功'));
});

/**
 * 暴露
 */
module.exports = router;