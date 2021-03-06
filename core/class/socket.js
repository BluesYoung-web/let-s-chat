/**
 * 用于websocket管理的类
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */
class Socket{
	/**
	 * 用于websocket管理的类
	 * @param {object} args 
	 * @param {string} args.url websocket服务器地址
	 * @param {string} args.url websocket服务器地址
	 * @param {function} args.onOpen websocket连接正常打开的回调函数
	 * @param {function} args.onMessage 收到消息的回调函数
	 * @param {function} args.onClose websocket连接关闭的回调函数
	 * @param {function} args.onError websocket连接出错的回调函数
	 * @param {function} args.onDisconnect websocket连接失败的回调函数
	 */
	 constructor(args){
        let {url, params, onOpen, onMessage, onClose, onError, onDisconnect} = {...args};
		/**
		 * @type {number} 最大重连次数
		 */
		this.maxReConnectNum = params && params.num || 5;
		/**
		 * @type {string} websocket连接的url
		 */
		this.url = url;
		/**
		 * @type {boolean} 连接正常打开的标志
		 */
		this.is_open_socket = false;
		/**
		 * @type {function} 连接正常打开的回调函数
		 */
		this.onOpen = onOpen;
		/**
		 * @type {function} 收到消息的回调函数
		 */
		this.onMessage = onMessage;
		/**
		 * @type {function} 连接关闭的回调函数
		 */
		this.onClose = onClose;
		/**
		 * @type {function} 连接出错的回调函数
		 */
		this.onError = onError;
		/**
		 * @type {function} 连接失败的回调函数
		 */
		this.onDisconnect = onDisconnect;
		/**
		 * @type {boolean} 主动断开标志
		 */ 
		this.doClose = false;
    }
    /**
	 * socket对象初始化
	 * @param {function} suc 初始化完成的回调函数
	 */
    init(suc){
        let self = this;
		console.log(this.url);
		let url = this.url;
		/**
		 * @type {object} socket对象
		 */
		this.socketTask = uni.connectSocket({
			url,
			success: () => {}
		});
		// 事件监听
		this.socketTask.onOpen(() => {
			// 连接正常，改变socket连接标志
            self.is_open_socket = true;
            // 此时才能正常收发消息
			console.log("websocket连接正常打开中......");
			if(self.onOpen){
				// 连接建立成功的回调函数
				suc && suc();
				self.onOpen && self.onOpen();
			}
		});
		this.socketTask.onMessage((res) => {
			// 收到消息
			let data = JSON.parse(res.data);
			self.onMessage && self.onMessage(data);
		});
		this.socketTask.onClose((code) => {
			// 连接断开，改变socket连接标志
			self.is_open_socket = false;
			// 如果没有监听关闭事件则自动重连
			if(!self.onClose){
				self.reConnect();
			}else{
                self.onClose && self.onClose(code);
            }
		});
		this.socketTask.onError((code) => {
			// 连接错误，改变socket连接标志
            self.is_open_socket = false;
            // 如果没有监听错误事件则自动重连
			if(!self.onError){
				self.reConnect();
			}else{
                self.onError && self.onError(code);
            }
		});
    }
    /**
	 * 通过socket连接发送消息
	 * @param {object} args
	 * @param {object} args.msg 消息内容
	 * @param {function} args.success 发送成功的回调函数
	 * @param {function} args.fail 发送失败的回调函数
	 */
    send(args){
        let {msg, success, fail} = {...args};
        let data = JSON.stringify(msg);
		console.log(data);
		this.is_open_socket && this.socketTask.send({
									data,
									success: (res) => {
                                        console.log("消息发送成功");
                                        success && success(res);
									},
									fail: (err) => {
										fail && fail(err.code,err.msg);
										console.log("消息发送失败");
									}
								});
		this.is_open_socket || fail && fail(-1, "连接已断开");
    }
    /**
	 * 主动关闭连接
	 */
    close(){
        let params = {
			code: 1000,
			reason: "I want to close socket",
			success: () => {
				console.log("I want to close socket");
			}
		}
		this.socketTask && this.socketTask.close(params);
		this.doClose = true;
    }
    /**
	 * 断线重连
	 */
    reConnect (){
		// 是否超过最大重连次数 || 连接正常打开
		if(this.maxReConnectNum && !this.is_open_socket){
			// 1s后自动重连
			setTimeout(() => {
				console.log("断线重连", this.maxReConnectNum);
				this.init();
				this.maxReConnectNum--;
			}, 1000);
		}else{
			// 超过最大重连次数
			this.onDisconnect();
		}
	}
}

export default Socket;