<script>
	// 管理账号信息缓存
	import service from 'service.js';
	import {mapState,mapMutations} from 'vuex';
	import request from '@/request/request.js';
	import socket from '@/socket/socket.js';
	export default {
		data(){
			return {
				is_timeout:false,
				is_offline:false
			}
		},
		watch: {
			socketTask:{
				handler(newValue, oldValue) {
					if(newValue.readyState==3 && this.is_open_socket==true){
						console.log("掉线啦****************************");
						// 清除token
						this.deleteToken();
						// 断线重连
						if(! this.is_offline){
							this.is_offline=true;
							setTimeout(()=>{
								socket.connectSocketInit();
								this.is_offline=false;
							},1000);
						}
						// 60s，登录超时
						if(! this.is_timeout){
							// 只设置一个定时器
							this.is_timeout=true;
							setTimeout(()=>{
								console.log("登录超时");
								uni.showModal({
									showCancel:false,
								    title: '提示',
								    content: '登录超时，请重新登陆',
								    success: (res)=> {
								        if (res.confirm) {
								            uni.reLaunch({
								            	url:"/pages/common/login/login"
								            });
								        } 
								    }
								});
							},60000);
						}
					}
				},
				deep:true
			}
		},
		methods:{
			...mapMutations(['setInfo','addFriendFromCache','addFinds','addConversationFromCache','deleteToken']),
		},
		computed:{
			...mapState(['userInfo','findLists','is_open_socket','socketTask'])
		},
		onLaunch() {
			console.log('App Launch');
			//在加载函数中监听缓存，管理登陆状态，如果缓存中有用户登录信息，就不必要每次打开应用都需要登录
			let userInfo = service.getUsers();
			userInfo=userInfo[0];
			console.log("读取缓存："+JSON.stringify(userInfo));
			// 是否有账户信息
			if(userInfo != undefined){
				// 将用户信息写入state
				this.setInfo(userInfo);
				// 从缓存读取消息列表
				this.addConversationFromCache(service.getConversation());
				// 从缓存中读取好友列表
				this.addFriendFromCache(service.getFriends());
				// 从缓存中读取好友圈
				// this.addFinds(service.getFinds());
				//连接websocket服务器
				// 进入这个页面的时候创建websocket连接【整个页面随时使用】
				socket.connectSocketInit();
			}
			// console.log("缓存读取好友圈");
			// 长轮询，如果好友圈发生变化则显示小红点
			// setInterval(()=>{
			// 	request.getLatestFinds((data)=>{
			// 		console.log("长轮询");
			// 		if(data.length != this.findLists.length){
			// 			// 显示好友圈的小红点
			// 			uni.showTabBarRedDot({
			// 				index: 2
			// 			});
			// 		}
			// 	});
			// },30000);
			
		},
		onShow() {
			console.log('App Show');
		},
		onHide() {
			console.log('App Hide');
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("common/common.css");
	
</style>
