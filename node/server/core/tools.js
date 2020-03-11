/**
 * 工具函数模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * HTTP返回数据格式化处理
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
 * websocket 返回参数格式化
 * @param {object} args
 * @param {number} args.status 状态码
 * @param {object} args.data 数据
 * @param {number} args.cbk 回调函数id
 * @param {object} args.extra 透传参数
 */
const resFormat = function(args){
    let {status, data, cbk, extra} = {...args};
    status = status == undefined ? 0 : status;
    data = data == undefined ? {} : data;
    cbk = cbk == undefined ? 0 : cbk;
    extra = extra == undefined ? {} : extra;
    let obj = {
        status,
        data,
        cbk,
        extra
    }
    return JSON.stringify(obj);
}
/**
 * websocket 推送消息格式化
 * @param {object} args 
 * @param {number} args.model 首层监听
 * @param {number} args.type 二层监听
 * @param {number} args.id 三层监听
 * @param {number} args.data 数据
 */
const pushFormat = function(args){
    let {model, type, id, data} = {...args};
    model = model == undefined ? 0 : model;
    type = type == undefined ? 0 : type;
    id = id == undefined ? 0 : id;
    data = data == undefined ? {} : data;
    let obj = {
        model,
        type,
        id,
        data
    }
    return JSON.stringify(obj);
}
/**
 * 暴露
 */
module.exports = {
    respondProcess,
    paramsSeparate,
    resFormat,
    pushFormat
}