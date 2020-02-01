// 网络请求相关
import Socket from '@/core/socket.js';
import config from '@/core/config.js';

let socket = null;
// 连接正常打开
const onOpen = function(){

}
// 连接关闭
const onClose = function(){

}
// 收到消息
const onMessage = function(){

}
// 连接出错
const onError = function(){

}
// 无法连接
const onDisconnect = function(){

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
const send = function(){

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
		fail: (err) => {
			fail && fail(err.msg);
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