// socket 类
class Socket{
    constructor(args){
        let {url, params, onOpen, onMessage, onClose, onError, onDisconnect} = {...args};
        // 最大重连次数
        this.maxReConnectNum = params && params.num || 5;
        this.url = url;
        this.is_open_socket = false;
        this.onOpen = onOpen;
        this.onMessage = onMessage;
        this.onClose = onClose;
        this.onError = onError;
        this.onDisconnect = onDisconnect;        
    }
    // 初始化
    init(suc){
        let self = this;
		console.log(this.url);
		let url = this.url;
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
				self.onOpen();
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
                self.onClose(code);
            }
		});
		this.socketTask.onError((code) => {
			// 连接错误，改变socket连接标志
            self.is_open_socket = false;
            // 如果没有监听错误事件则自动重连
			if(!self.onError){
				self.reConnect();
			}else{
                self.onError(code);
            }
		});
    }
    // 发消息
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
    // 主动关闭socket连接
    close(){
        let params = {
			code: 1000,
			reason: "I want to close socket",
			success: () => {
				console.log("I want to close socket");
			}
		}
		this.socketTask && this.socketTask.close(params);
    }
    // 重连
    reConnect (){
		// 是否超过最大重连次数 || 连接正常打开
		if(this.maxReConnectNum && !this.is_open_socket){
			// 1s后自动重连
			setTimeout(() => {
				console.log("断线重连");
				this.init();
				this.maxReConnectNum--;
			},1000);
		}else{
			// 超过最大重连次数
			this.onDisconnect();
		}
	}
}

export default Socket;