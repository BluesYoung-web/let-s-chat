<template>
	<!-- 消息页面  -->
	<view>
		<!-- 自定义导航栏 -->
		<uni-nav-bar title="消息" background-color="#344955" color="#ffffff"
		right-icon="plusempty" @clickRight="clickPlus"></uni-nav-bar>
		<!-- 下拉气泡菜单 -->
		<bubble-menu :ifShow="isShowbubble" :x='x' :y="y" theme="dark" 
		:popData="popData" @close="close" @clickMenu="clickMenu"></bubble-menu>
		<!-- 聊天列表组件 -->
		<scroll-view scroll-y="true">
			<mz-network-error @clickFn="netError"></mz-network-error>
			<chat-item :dataList = "dataList" @clickInto = "onClickInto" @clickChoice = "onClickChoice"
			></chat-item>
		</scroll-view>
	</view>
</template>

<script>
	import chatItem from '@/components/young-chat-item/young-chat-item.vue';
	import mzNetworkError from '@/components/mz-network-error/mz-network-error.vue'
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import bubbleMenu from "@/components/young-bubble-menu/young-bubble-menu.vue";
	import data from '@/data.js';
	/**
	 * 提前获取，避免初次发送语音时提示获取录音权限
	 */
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	export default {
		components:{
			chatItem,
			uniNavBar,
			bubbleMenu,
			mzNetworkError
		},
		data(){
			return {
				x: 0,
				y: 0,
				isShowbubble: false,
				popData: [{
					title: '发起群聊',
					icon: 'chatbubble-filled',
					}, {
					title: '添加朋友',
					icon: 'personadd-filled',
					}, {
					title: '扫一扫',
					icon: 'scan'
					}, {
					title: '分享给朋友',
					icon: 'upload'
					}, {
					title: '帮助与反馈',
					icon: 'email'
				}],
				dataList: [],
				user: {}
			}
		},
		created() {
			/**
			 * 计算消息气泡相对位置
			 */
			let sys = uni.getSystemInfoSync();
			this.x = sys.screenWidth * 0.9;
			this.y = sys.screenHeight / 20;
		},
		onShow(){
			this.init();
		},
		onLoad(){
			/**
			 * 改变tabBar角标
			 */
			uni.setTabBarBadge({
				index: 0,
				text: this.countMsg + ''
			});
			data.user.get_info({
				success: (res) => {
					this.user = res;
				}
			});
			/**
			 * 提前获取录音权限
			 */
			recorderManager.start({
				format: 'mp3'
			});
			setTimeout(() => {
				recorderManager.stop();
				console.log('已关闭录音');
			}, 500);
		},
		// 观察者
		watch: {
			// 深度观察(任何一个属性变化都会触发)
			dataList: {
				handler(newValue, oldValue) {
					// 缓存写入
					// 动态改变消息数
					this.changMsgNum();
				},
				deep: true
			}
		},
		methods:{
			/**
			 * 网络错误
			 */
			netError(){
				uni.navigateTo({
					url: '/pages/error/networkError'
				});
			},
			/**
			 * 点击右上角加号
			 */
			clickPlus(){
				this.isShowbubble = true;
			},
			/**
			 * 关闭气泡菜单
			 */
			close(){
				this.isShowbubble = false;
			},
			/**
			 * 点击气泡菜单
			 */
			clickMenu(item){
				switch (item.title){
					case '发起群聊':
						this.toCreateChatRoom();
						break;
					case '添加朋友':
						this.toUserSearch();
						break;
					default:
						uni.showToast({
							title: "敬请期待！"
						});
						break;
				}
			},
			/**
			 * 去创建群聊
			 */
			toCreateChatRoom(){
				uni.navigateTo({
					url:"/pages/addressSubpackage/createChatRoom"
				});
			},
			/**
			 * 去搜索用户
			 */
			toUserSearch(){
				uni.navigateTo({
					url:"/pages/addressSubpackage/addFriends"
				});
			},
			/**
			 * 改变未读消息数
			 */
			changMsgNum() {
				const num = this.countMsg;
				if (num == 0) {
					uni.removeTabBarBadge({
						index: 0
					});
				} else {
					uni.setTabBarBadge({
						index: 0,
						text: num + ''
					});
				}
			},
			/**
			 * 消息置顶
			 */
			setTop(event, item){
				if(this.dataList[0].roomId == item.roomId){
					this.dataList[0].isTop = 1;
				}else{
					this.dataList.sort((a, b) => {
						// 排序、改变样式
						if(b.roomId == item.roomId){
							b.isTop = 1;
							return 1;
						}else{
							b.isTop = 0;
							return -1;
						}
					});
				}
				// 存储到缓存
				data.chat.set_room_list({
					roomList: this.dataList,
					success: () => {
						console.log("缓存修改成功");
						// 重新渲染
						this.init();
					},
					fail: () => {
						console.log("缓存修改失败");
					}
				});
			},
			/**
			 * 取消置顶
			 */
			clearTop(event, item){
				// 按时间排序
				this.dataList.sort((a, b) => b.ot - a.ot);
				// 改变样式
				this.dataList.map((v) => v.roomId == item.roomId ? v.isTop = 0 : v.isTop = v.isTop || 0);
				// 存储到缓存
				data.chat.set_room_list({
					roomList: this.dataList,
					success: () => {
						console.log("缓存修改成功");
						// 重新渲染
						this.init();
					},
					fail: () => {
						console.log("缓存修改失败");
					}
				});
			},
			/**
			 * 标记为已读
			 */
			setIKnow(item){
				this.dataList.map((v) => v.roomId == item.roomId ? v.msgNum = 0 : null);
				// 存储到缓存
				data.chat.clear_msg_num({
					roomId: item.roomId,
					success: () => {
						console.log(item.roomId, '设为已读成功');
					}
				});
			},
			/**
			 * 删除某条对话
			 */
			deleteMessage(item, index) {
				uni.showModal({
					title: '提示',
					content: '删除该对话及删除对应的聊天记录？',
					success: (res) => {
						this.dataList.splice(index, 1);
						//同时减少消息tabBar右上角数字，num为零时移除
						this.changMsgNum();
						let roomId = item.roomId;
						if (res.confirm) {
							data.chat.clear_chat_log_list({
								roomId,
								success: () => {
									console.log('删除该聊天记录成功');
									this.init();
								},
								fail: () => {
									console.log('删除该聊天记录失败');
								}
							});
						} else{
							// 存储到缓存
							data.chat.set_room_list({
								roomList: this.dataList,
								success: () => {
									console.log("缓存修改成功");
									// 重新渲染
									this.init();
								},
								fail: () => {
									console.log("缓存修改失败");
								}
							});
						}
					}
				})
			},
			/**
			 * 直接点击对话进入某个聊天室
			 * @param {Object} item
			 */
			onClickInto(item){
				this.setIKnow(item);
				uni.navigateTo({
					url:`../messageSubpackage/conversation?roomId=${item.roomId}&title=${item.nick}`
				});
			},
			/**
			 * 滑动开关
			 * @param {Object} event
			 * @param {Object} item
			 * @param {Object} index
			 */
			onClickChoice(event, item, index){
				switch (event.index){
					case 0:
						console.log("消息置顶");
						if(event.content.text == "置顶"){
							this.setTop(event, item);
						}else{
							this.clearTop(event, item);
						}
						break;
					case 1:
						console.log("标记为已读");
						this.setIKnow(item);
						break;
					case 2:
						console.log("删除");
						this.deleteMessage(item, index);
						break;
				}
			},
			/**
			 * 页面初始化
			 */
			init(){
				setTimeout(() => {
					// 从缓存获取聊天列表
					data.chat.get_room_list((res) => {
						console.log(res);
						this.dataList = res;
						// 后收到的消息排到前面
						// 置顶的消息排到前面
						console.log(JSON.stringify(this.dataList));
						// 显示tabBar的角标
						this.changMsgNum();
					}, true);
				}, 100);
			}
		},
		computed:{
			/**
			 * 计算未读消息条数
			 */
			countMsg() {
				let msgCount = 0;
				for (let i in this.dataList) {
					msgCount += this.dataList[i].msgNum;
				}
				msgCount = msgCount > 99 ? '99+' : msgCount;
				return msgCount;
			},
		}
	}
</script>


<style>
</style>
