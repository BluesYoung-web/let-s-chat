/**
 * 工具函数模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 返回数据格式化处理
 * @param {number} status 状态码 0-成功， -1失败
 * @param {JSON} data 返回的数据对象
 * @param {string} msg 提示信息
 */
const respondProcess = function(status, data, msg){
    let obj = {
        status,
        data,
        msg
    }

    return JSON.stringify(obj);
}

/**
 * websocket连接参数分离
 * @param {string} str 
 */
const paramsSeparate = function(str){
    str = str.split('');
    str.shift();
    str.shift();
    str = str.join('');
    str = str.split('&');
    let [p1, p2] = [...str];
    p1 = p1.split('=');
    p2 = p2.split('=');
    return {
        [p1[0]]: p1[1],
        [p2[0]]: p2[1]
    }
}
/**
 * 暴露
 */
module.exports = {
    respondProcess,
    paramsSeparate
}