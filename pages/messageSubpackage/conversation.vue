<template>
	<!-- 对话页面 -->
	<view class="flex flex-direction-column">
		<!-- 聊天记录 -->
		<view class="content" @tap="takeBack">
			<scroll-view scroll-y="true" :scroll-with-animation="true" :style="{height:scrollHeight + 'px'}"
			 :scroll-top="scrollTop" id="sc">
			 <view class="scroll">
			 	<msg-item v-for="(item, index) in messages" :message="item" :key="index"
				@preImg="preImg" @clickAvatar="clickAvatar" @playVoice="playVoice"></msg-item>
			 </view>
			</scroll-view>
		</view>
		<!-- 底部文字语言输入框 -->
		<view class="conversationBottom" :style="'bottom: '+ bottom +'upx'">
			<!-- 输入键盘组件 -->
			<key-board :isVoice="isVoice" :content="content" :pressActive="pressActive"
			@getInputMsg="getInputMsg" @inputChange="inputChange"
			@showEmoji="showEmojiKeyBoard" @inputFocus="takeBack"
			@startRecord="startRecord" @endRecord="endRecord" @cancelVoice="cancelVoice"
			@send="send" @plus="showPlusKeyBoard"></key-board>
		</view>
		<!-- 表情键盘组件 -->
		<emoji-input :showEmoji="showEmoji" :emojiData="emojiData"
		@showFaces="showFaces" @deleteEmoji="backSpace" @select="changeEmojiType"></emoji-input>
		<!-- 扩展菜单组件 -->
		<ext-input :showPlus="showPlus" :plusMenu="plusMenu" @clickItem="clickItem"></ext-input>
	</view>
</template>

<script>
	//表情引入
	const emoji = require("@/static/emojis/emoji.json");
	const emojiFood = require("@/static/emojis/food.json");
	
	//获取录音权限相关
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();	
	innerAudioContext.autoplay = true;
	
	import emojiInput from '@/components/young-emoji-input/young-emoji-input.vue';
	import keyBoard from '@/components/young-key-board/young-key-board.vue';
	import msgItem from '@/components/young-msg-item/young-msg-item.vue';
	import extInput from '@/components/young-ext-input/young-ext-input.vue';
	import data from '@/data.js';
	import tools from '@/core/tools';
	export default{
		components: {
			emojiInput,
			keyBoard,
			msgItem,
			extInput
		},
		mounted() {
			this.scrollToBottom(-50);
		},
		data(){
			return{
				/**
				 * 是否语音输入
				 */
				isVoice: false,
				/**
				 * 是否显示表情面板
				 */
				showEmoji: false,
				/**
				 * 是否显示扩展面板（发送图片）
				 */
				showPlus: false,
				/**
				 * 表情面板的数据
				 */
				emojiData:[{
					id: 0,
					emojiSrc: emoji,
					emojiList: [],
					src: '/static/img/emoji/face.png',
					select: true
					}, {
					id: 1,
					emojiSrc: emojiFood,
					emojiList: [],
					src: '/static/img/emoji/food.png',
					select: false
				}],
				/**
				 * 扩展菜单
				 */
				plusMenu: [{
					op: 'chooseImg',
					src: '/static/img/album.png'
					},{
					op: 'takePhoto',
					src: '/static/img/photo.png'
				}],
				scrollHeight: '',
				scrollTop: 0,
				/**
				 * 聊天记录
				 */
				messages:[],
				/**
				 * 要发送的消息内容
				 */
				content:'',
				/**
				 * 是否显示取消发送语音
				 */
				pressActive: false,
				/**
				 * 控制键盘高度变化
				 */
				bottom:0,
				/**
				 * 语音临时路径
				 */
				voicePath: '', 
				/**
				 * 图片临时路径
				 */
				imgPath: '',
				/**
				 * 语音时间长度
				 */
				intervalTime: 0,
				/**
				 * 录音计时定时器
				 */
				timer: null,
				/**
				 * 滑动位置记录
				 */
				swiper: null,
				/**
				 * 聊天室id
				 */
				roomId: null,
				/**
				 * 当前用户信息
				 */
				user: {}
			}
		},
		onLoad(e) {
			/**
			 * 获取当前用户信息
			 */
			data.user.get_info({
				success: (res) => {
					this.user = res;
				}
			});
			if(e.voiceActive == 1) {
				this.isVoice = true;
			} 
			if(e.title) {
				uni.setNavigationBarTitle({
					title: e.title
				});
			}
			this.roomId = e.roomId;
			data.chat.get_room_info({
				roomId: this.roomId,
				success: (res) => {
					if (res.title != 'null' && res.title != e.title) {
						uni.setNavigationBarTitle({
							title: res.title
						});
					}
				},
				fail: (code, err) => {
					console.log(code, err);
				}
			});
			/**
			 * 收到新消息，滚动到底部
			 */
			uni.$on(this.roomId+'.onMsg', () => {
				// 显示时间处理
				this.messages[0].time = tools.timeFormat(this.messages[0].ot);
				for (let i = 1; i < this.messages.length; i++) {
					let ot = this.messages[i].ot;
					let lt = this.messages[i-1].ot;
					this.messages[i].time = tools.timeDec(ot, lt, 60000);
				}
				setTimeout(() => {
					this.scrollToBottom();
				}, 100);
			});
			//获取录音权限相关
			recorderManager.onStop((res)=>{
				this.voicePath = res.tempFilePath;
				if(this.swiper === true){
					// 录音结束，自动发送
					this.uploadVoice();
				}else {
					console.log('取消发送');
				}
			});
		},
		onShow(){
			data.chat.get_chat_log_list({
				roomId: this.roomId,
				success: (res) => {
					this.messages = res;
					// 显示时间处理
					this.messages[0].time = tools.timeFormat(this.messages[0].ot);
					for (let i = 1; i < this.messages.length; i++) {
						let ot = this.messages[i].ot;
						let lt = this.messages[i-1].ot;
						this.messages[i].time = tools.timeDec(ot, lt, 60000);
					}
				}
			});
		},
		onBackPress() {
			data.chat.clear_msg_num({
				roomId: this.roomId,
				success: () => {
					console.log(this.roomId, '设为已读成功');
				}
			});
		},
		methods:{
			/**
			 * 改变输入类型
			 */
			inputChange(){
				this.isVoice = !this.isVoice;
				this.showEmoji = false;
				this.showPlus = false;
				this.bottom = 0;
			},
			/**
			 * 获取输入的值
			 */
			getInputMsg(val){
				this.content = val;
			},
			/**
			 * 显示表情键盘
			 */
			showEmojiKeyBoard(){
				this.showPlus = false;
				if(!this.showEmoji){
					this.isVoice = false;
					this.showEmoji = true;
					this.bottom = 600;
				}else{
					this.showEmoji = false;
					this.bottom = 0;
				}	
			},
			/**
			 * 显示扩展键盘
			 */
			showPlusKeyBoard(){
				this.showEmoji = false;
				if(!this.showPlus){
					this.isVoice = false;
					this.showPlus = true;
					this.bottom = 600;
				}else{
					this.showPlus = false;
					this.bottom = 0;
				}	
			},
			/**
			 * 选择表情类型
			 */
			changeEmojiType(item){
				this.emojiData.forEach((v, i) => {
					if (v.id == item.id) {
						v.select = true;
					}else{
						v.select = false;
					}
				});
			},
			/**
			 * 点击输入框/空白处隐藏表情键盘
			 */
			takeBack(){
				this.showEmoji = false;
				this.showPlus = false;
				this.bottom = 0;
			},
			/**
			 * 删除表情
			 */
			backSpace(){
				let msg = this.content;
				msg = Array.from(msg);
				msg.pop();
				msg = msg.join("");
				this.content = msg;
			},
			/**
			 * 上传语音文件
			 */
			uploadVoice(){
				// 上传到服务器
				data.user.upload({
					filePath: this.voicePath,
					name: 'audio',
					success: (res) => {
						console.log(res);
						if(res.status == 0){
							// 上传成功
							this.voicePath = res.data.url;
							this.sendVoice();
						}else{
							uni.showToast({
								title:"语音文件上传失败！"
							});
						}
					}
				});
			},
			/**
			 * 上传图片文件
			 */
			uploadImg(){
				// 上传到服务器
				data.user.upload({
					filePath: this.imgPath,
					name: 'img',
					success: (res) => {
						console.log(res);
						if(res.status == 0){
							// 上传成功
							this.imgPath = res.data.url;
							this.sendImg();
						}else{
							uni.showToast({
								title:"图片文件上传失败！"
							});
						}
					}
				});
			},
			/**
			 * 发送文字消息
			 */
			send(){
				data.chat.send_msg({
					roomId: this.roomId,
					msg: {
						type: 0,
						uid: this.user.uid,
						roomId: this.roomId,
						ot: Date.parse(new Date()),
						content: this.content				
					},
					success: (res) => {
						console.log(res);
						this.content = '';
					},
					fail: (code, err) => {
						console.log(code, err);
					}
				});
			},
			/**
			 * 发送语音消息
			 */
			sendVoice(){
				data.chat.send_msg({
					roomId: this.roomId,
					msg: {
						type: 1,
						uid: this.user.uid,
						roomId: this.roomId,
						ot: Date.parse(new Date()),
						content: this.voicePath,
						voiceTime: this.intervalTime
					},
					success: (res) => {
						console.log(res);
						console.log('语音消息发送成功');
					},
					fail: (code, err) => {
						console.log(code, err);
					}
				});
			},
			/**
			 * 发送图片消息
			 */
			sendImg(){
				data.chat.send_msg({
					roomId: this.roomId,
					msg: {
						type: 2,
						uid: this.user.uid,
						roomId: this.roomId,
						ot: Date.parse(new Date()),
						content: this.imgPath,
					},
					success: (res) => {
						console.log(res);
						console.log('图片消息发送成功');
					},
					fail: (code, err) => {
						console.log(code, err);
					}
				});
			},
			/**
			 * 滚动到最底部
			 */
			scrollToBottom(h){
				h = h || 5;
				this.scrollHeight = uni.getSystemInfoSync().windowHeight;
				let info2 = uni.createSelectorQuery().select(".conversationBottom");
				info2.boundingClientRect((data)=>{
					//屏幕高度-底部键盘区高度
					// #ifdef APP-PLUS
					this.scrollHeight = this.scrollHeight - data.height - 10;
					// #endif
					// #ifdef H5
					this.scrollHeight = this.scrollHeight - data.height - h;
					// #endif
				}).exec();
				let info = uni.createSelectorQuery().select(".scroll");
					info.boundingClientRect((data)=>{
					this.scrollTop = data.height - this.scrollHeight;
				}).exec();
			},
			/**
			 * 输入表情
			 */
			showFaces(item){
				this.content += item;
			},
			/**
			 * 点击扩展菜单
			 */
			clickItem(item){
				let src = '';
				switch (item.op) {
					case 'chooseImg':
						src = 'album';
						break;
					case 'takePhoto':
						src = 'camera';
						break;
					default:
						break;
				}
				let config={
					count: 1,
					sourceType: [src],
					sizeType: ['compressed'],
					success: res => {
						this.imgPath = res.tempFilePaths[0];
						this.uploadImg();
					},
					fail: res => {
						uni.showToast({
							title:"用户取消或加载超时",
							icon:"none"
						});
					},
				}
				uni.chooseImage(config);
			},
			/**
			 * 预览图片
			 */
			preImg(src){
				uni.previewImage({
					urls: [src],
					longPressActions: {
						itemList: ['保存图片'],
						success: (data)=>{
							//点击保存就调用保存到相册的接口
							if (data.tapIndex == 0) {
								uni.saveImageToPhotosAlbum({
									filePath: item.dynamicImg,
									success: ()=> {
										uni.showToast({
											icon: "none",
											title: "保存成功"
										})
									},
									fail:()=> {
										uni.showToast({
											icon: "none",
											title: "保存失败"
										})
									}
								});
							}
						},
						fail: (err)=> {
							console.log(err.errMsg);
						}
					}
				});
			},
			/**
			 * 点击头像
			 */
			clickAvatar(uid){
				if (uid == this.user.uid) {
					uni.switchTab({
						url: '/pages/tabBar/my'
					});
				} else {
					uni.navigateTo({
						url: `/pages/addressSubpackage/friendsInfo?uid=${uid}`
					});
				}
			},
			/**
			 * 播放语音
			 */
			playVoice(src){
				console.log('播放语音',src);
				innerAudioContext.src = src;
				innerAudioContext.play();
			},
			/**
			 * 长按开始录音，取消录音提示框出现
			 */
			startRecord() {
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: '浏览器暂不支持发送语音'
				});
				// #endif
				// #ifdef APP-PLUS
				this.timer = setInterval(() => {
				    this.intervalTime += 0.5;
					if (this.intervalTime >= 0.5 && !this.pressActive) {
				        // 如果用户录制的时间太短,就不会去开启录音
				        console.log("开始录音");
				        this.pressActive = true;
				        this.intervalTime = 0;
				        recorderManager.start({
							format: 'mp3'
						});
				    }
				}, 500);
				// #endif
			},
			/**
			 * 可能要取消发送语音
			 */
			cancelVoice(e){
				console.log('开始滑动');
				this.swiper = e.changedTouches[0].clientY;
			},
			/**
			 * 松开手指，录音结束/上滑取消发送，取消录音提示框消失
			 */
			endRecord(e) {
				// #ifdef APP-PLUS
				let end = e.changedTouches[0].clientY;
				this.pressActive = false;
				clearInterval(this.timer);
				recorderManager.stop();
				console.log('录音结束');
				if(this.swiper - end > 80){
					// 取消发送
					this.swiper = false;
				}else {
					// 正常发送
					this.swiper = true;
				}
				// #endif
			}
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.conversationBottom{
		position: fixed;
		width: 100%;
		background-color: @codeBorder;
		padding-top: 10upx;
		padding-bottom: 20upx;
	}
</style>
