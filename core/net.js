// 网络请求相关
import Socket from '@/core/class/socket.js';
import config from '@/core/config.js';
import event from '@/core/event.js';

let socket = null;
// 回调函数列表
let callbackList = {};
let callbackListNum = 0;
// 连接正常打开
const onOpen = function(){
    console.log("连接正常");
}
// 连接关闭
const onClose = function(){
    console.log("连接关闭");
}
// 收到消息
const onMessage = function(){
    console.log('***************收到消息了');
	console.log(data);
	if(data.cbk){
		// 如果存在对应的回调函数
		if(callbackList[data.cbk]){
			if(data.status == 0){
				if(callbackList[data.cbk].success){
					callbackList[data.cbk].success(data.data);
				}
			}else{
				if(callbackList[data.cbk].fail){
					callbackList[data.cbk].fail(data.status,data.data); 
				}
			}
			delete callbackList[data.cbk];
		}else{
			console.log("net----------没有对应的回调函数,使用广播");
			event.broadcast(data.model, data.type, data.id, data.data);
		}
	}else{
		// 没有对应回调函数则使用事件分发
		event.dispatch(data.model, data.type, data.id, data.data);
	}
}
// 连接出错
const onError = function(){
    console.log("连接出错");
}
// 无法连接
const onDisconnect = function(){
    console.log("连无法连接到网络，请检查网络连接后重试");
    event.dispatch(100, 4001, "超过最大重连次数");
}
// 初始化
const init = function(success){
    let url = config.websocketUrl;
    socket = new Socket({
        url,
        params: {
            num: 5
        },
        onOpen,
        onClose,
        onMessage,
        onError,
        onDisconnect
    });
    success && socket.init(success);
}
// 发送消息
const send = function(args){
    let {cmd, data, extra, success, fail} = {...args};
    callbackListNum++;
	callbackList[callbackListNum] = {
		success,
		fail
	}
    let msg = {
        cmd,
        data,
        cbk: callbackListNum,
        extra
    }
    socket.send({
        msg,
        fail: (code, err) => {
		    fail && fail(code,err);
            delete callbackList[callbackListNum];
        }
    });
}
// http 请求
const http = function(args){
    let {path, params, method, success, fail} = {...args};
    uni.request({
		url: config.httpUrl + path,
		method,
		header: {
			'content-type':'application/x-www-form-urlencoded',
		},
		data: params,
		success: (res) => {
			if(res.data.status == 0){
				success && success(res.data.data);
			}else{
				fail && fail(res.data);
			}
		},
		fail: (code, err) => {
			fail && fail(code, err);
		}
	});
}
// get 请求
const get = function(args){
    let {path, success, fail} = {...args};
    http({
        path,
        method: 'GET',
        success,
        fail
    });
}
// post 请求
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
export default {
    init,
    send,
    get,
    post
}