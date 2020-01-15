// 从state获取数据
import store from '@/store/index.js';
// 缓存管理
import service from '@/service.js';
// 请求抽离
import request from '@/request/request.js';
// 工具函数
import tools from '@/tools/tools.js';
// 服务器地址
const websocketUrl=store.getters.websocketUrl;
// 本机用户信息
const userInfo=store.getters.userInfo;
// socketTask
let socketTask;
let is_open_socket;
// 初始化,连接websocket
const connectSocketInit = function(){
	// 创建一个socketTask对象【发送、接收、关闭socket都由这个对象操作】
	socketTask = uni.connectSocket({
	// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
		url: websocketUrl,
		success:()=> {}
	});
	store.commit('addSocketTask',socketTask)
	// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
	socketTask.onOpen((res) => {
		console.log("WebSocket连接正常打开中...！");
		is_open_socket = true;
		store.commit('changeSocketFlag',is_open_socket);
		// 注：只有连接正常打开中 ，才能正常成功发送消息
		// 注：只有连接正常打开中 ，才能正常收到消息
		socketTask.onMessage((res) => {
			let temp=JSON.parse(JSON.parse(res.data));
			// 如果是接收token
			if(temp.token){
				store.commit('addToken',temp.token);
				return;
			}
			// 正常接收消息
			let dt=temp.Data;
			console.log(dt);
			//消息震动
			uni.vibrateLong({
			    success: function () {
			        console.log('success');
			    }
			});
			let tp={
				imgUrl:dt.head,
				time:dt.time,
				intervalTime:dt.intervalTime,
				content:dt.content,
				realContent:dt.realContent,
				account:temp.ID,
				right: 0,
				msgNum:1,
				conversation:[
					{
						sign:dt.sign,
						head:dt.head,
						content:dt.content,
						realContent:dt.realContent,
						time:dt.time,
						intervalTime:dt.intervalTime,
					}
				]
			};
			tp.time=tools.showTime(tp.time);
			// 暂时从服务器获取，后期从暂存或缓存获取
			request.getUserInfo(temp.ID,(data)=>{
				tp.username=data.name;
				// 推送到消息列表,暂存到对话页面
				store.commit('addMessageList',tp);
			});
		});
	});
	// 这里仅是事件监听【如果socket关闭了会执行】
	socketTask.onClose(() => {
		console.log("连接已断开");
		is_open_socket = false;
		store.commit('changeSocketFlag',is_open_socket);
	});
	// 进入之后延时1s注册
	setTimeout(()=>{
		register(userInfo.account, socketTask);
	},1000);
}
// 断开socket连接
const closeSocket=function(){
	socketTask.close({
		success: (res) => {
			is_open_socket = false;
			store.commit('changeSocketFlag',is_open_socket);
			console.log("关闭成功", res)
		},
		fail: (err) => {
			console.log("关闭失败", err)
		},
	});
}
// 注册用户用的
const register = function(id, ws) {
	let Json = {
			'ID': id,
			'Op': "userRegister"
		};
	ws.send({
		data: JSON.stringify(Json),
		success:()=> {
			console.log("注册成功");
		},
		fail:()=> {
			setTimeout(()=>{
				register(id, ws);
			},1000);
		},
	});
}

export default {
	connectSocketInit,
	closeSocket,
	register
}