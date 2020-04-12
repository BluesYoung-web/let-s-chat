/**
 * 网络模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * @typedef {object} Socket socket类
 * @typedef {object} config 配置文件
 * @typedef {object} event 事件处理模块
 */
import Socket from '@/core/class/socket.js';
import config from '@/core/config.js';
import event from '@/core/event.js';
import store from '@/core/store.js';

/**
 * @type {Socket} socket对象
 */
let socket = null;
/**
 * 回调函数列表
 */
let callbackList = {};
/**
 * 回调函数对应的索引值(键值)
 */
let callbackListNum = 0;
/**
 * 连接正常打开的回调函数
 */
const onOpen = function(){
    console.log("连接正常");
}
/**
 * 连接关闭的回调函数
 */
const onClose = function(){
    console.log("连接关闭");
    if(socket.doClose){
        console.log('主动断开websocket');
    }else{
        event.dispatch({
            model: 100,
            type: 4001,
            id: 0,
            data: "连接已断开"
        });
    }
}
/**
 * 收到消息的回调函数
 * @param {object} data 
 * @param {number} data.cbk 操作的回调函数的索引
 * @param {number} data.status 操作的状态码 0 -> 成功, -1 -> 失败
 * @param {object} data.extra 透传参数
 * @param {object} data.data 操作取回的数据
 * @param {number} data.model 首层
 * @param {number} data.type 二层
 * @param {number} data.id 三层
 */
const onMessage = function(data){
    console.log('***************收到消息了');
    console.log(data);
    // 如果有回调函数的索引
	if(data.cbk){
		// 如果存在对应的回调函数
		if(callbackList[data.cbk]){
			if(data.status == 0){
				callbackList[data.cbk].success && callbackList[data.cbk].success(data.data);
			}else{
				callbackList[data.cbk].fail && callbackList[data.cbk].fail(data.status, data.data); 
			}
			delete callbackList[data.cbk];
		}else{
			console.log("net----------没有对应的回调函数,使用广播");
			event.broadcast({
                model: data.model,
                type: data.type,
                id: data.id,
                data: data.data
            });
		}
	}else{
		// 没有对应回调函数则使用事件分发
		event.dispatch({
            model: data.model,
            type: data.type,
            id: data.id,
            data: data.data
        });
	}
}
/**
 * 连接失败的回调函数
 */
const onDisconnect = function(){
    console.log("连无法连接到网络，请检查网络连接后重试");
    event.dispatch({
        model: 100,
        type: 4002,
        id: 0, 
        data:"超过最大重连次数"
    });
}
/**
 * socket初始化
 * @param {function} success 初始化完成的回调函数
 */
const init = function(success){
    let user = store.get({
        key: 'user.account'
    });
    let {sign, uid} = {...user};
    let url = `${config.websocketUrl}?sign=${sign}&uid=${uid}`;
    socket = new Socket({
        url,
        params: {
            num: 5
        },
        onOpen,
        onClose,
        onMessage,
        onDisconnect
    });
    success && socket.init(success);
}
/**
 * 发送消息
 * @param {object} args 
 * @param {number} args.cmd 操作的指令号
 * @param {object} args.data 发送的数据
 * @param {object} args.extra 透传参数
 * @param {function} args.success 发送成功的回调函数
 * @param {function} args.fail 发送失败的回调函数
 */
const send = function(args){
    let {cmd, data, extra, success, fail} = {...args};
    callbackListNum++;
	callbackList[callbackListNum] = {
		success,
		fail
    }
    /**
     * 消息发送的格式
     */
    let msg = {
        cmd,
        data,
        cbk: callbackListNum,
        extra
    }
    /**
     * 使用socket对象发送消息
     */
    socket.send({
        msg,
        /**
         * 失败的回调函数
         * @param {number} code 错误码
         * @param {object} err 错误提示
         * @param {object} err.data.status 状态码
         * @param {object} err.data.data 最终的数据
         * @param {object} err.data.msg 提示信息
         */
        fail: (code, err) => {
		    fail && fail(code,err);
            delete callbackList[callbackListNum];
        }
    });
}
/**
 * http 请求
 * @param {object} args 
 * @param {string} args.path http请求的路由
 * @param {object} args.params 传递的参数
 * @param {string} args.method 请求方法 get、post
 * @param {function} args.success 请求成功的回调函数
 * @param {function} args.fail 请求失败的回调函数
 */
const http = function(args){
    let {path, params, method, success, fail} = {...args};
    uni.request({
		url: config.httpUrl + path,
		method,
		header: {
			'content-type':'application/x-www-form-urlencoded',
		},
        data: params,
        /**
         * 成功的回调函数
         * @param {object} res 返回体(包含http头部信息)
         * @param {object} res.data 返回的数据
         * @param {object} res.data.status 状态码
         * @param {object} res.data.data 最终的数据
         * @param {object} res.data.msg 提示信息
         */
		success: (res) => {
			if(res.data.status == 0){
				success && success(res.data.data);
			}else{
				fail && fail(res.data.status, res.data.data);
			}
        },
        /**
         * 失败的回调函数
         * @param {number} code 错误码
         * @param {object} err 错误提示
         * @param {object} err.data.status 状态码
         * @param {object} err.data.data 最终的数据
         * @param {object} err.data.msg 提示信息
         */
		fail: (code, err) => {
			fail && fail(code, err);
		}
	});
}
/**
 * get 请求
 * @param {object} args 
 * @param {string} args.path 请求路由
 * @param {function} args.success 请求成功的回调函数
 * @param {function} args.fail 请求失败的回调函数
 */
const get = function(args){
    let {path, success, fail} = {...args};
    http({
        path,
        method: 'GET',
        success,
        fail
    });
}
/**
 * post 请求
 * @param {object} args 
 * @param {string} args.path 请求路由
 * @param {object} args.params 传递的参数
 * @param {function} args.success 请求成功的回调函数
 * @param {function} args.fail 请求失败的回调函数
 */
const post = function(args){
    let {path, params, success, fail} = {...args};
    http({
        path,
        params,
        method: 'POST',
        success,
        fail
    });
}
/**
 * 上传函数
 * @param {object} args 
 * @param {string} args.path 上传路由 
 * @param {string} args.filePath 本地文件路径 
 * @param {name} args.name 文件对象的键名 
 * @param {function} args.success 上传成功的回调函数 
 * @param {function} args.fail 上传失败的回调函数 
 */
const upload = function(args){
    let {path, filePath, name, success, fail} = {...args};
	let url = config.httpUrl + path;
	console.log(url);
	uni.uploadFile({
		url,
		filePath,
        name,
        formData: {
            type: name
        },
		success: (res) => {
			success && success(res);
		},
		fail: (err) => {
			fail && fail(err.code, err);
		}
	})
}
export default {
    init,
    send,
    get,
    post,
    upload,
    close: () => socket.close(),
	auto_reconnect: () => socket.reConnect(),
}