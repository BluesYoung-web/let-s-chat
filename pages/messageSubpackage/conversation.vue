<template>
	<!-- 对话页面 -->
	<view class="flex flex-direction-column">
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
			@send="send" @plus="plus"></key-board>
		</view>
		<!-- 表情键盘组件 -->
		<emoji-input :showEmoji="showEmoji" :emojiData="emojiData"
		@showFaces="showFaces" @deleteEmoji="backSpace" @select="changeEmojiType"></emoji-input>
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
	export default{
		components: {
			emojiInput,
			keyBoard,
			msgItem
		},
		mounted() {
			this.scrollToBottom();
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
				scrollHeight: '',
				scrollTop: 0,
				/**
				 * 聊天记录
				 */
				messages:[{
					type: 3,
					content: '打招呼'
				},{
					type: 0,
					uid: 7575838,
					time: '11:15',
					user: 'others',
					imgUrl: '/static/img/avatar.png',
					content: '来了老弟！'
				}, {
					type: 0,
					uid: 7575838,
					user: 'myself',
					imgUrl: '/static/img/friendhead.png',
					content: '好嗨哟！'
				}, {
					uid: 7575838,
					type: 1,
					user: 'others',
					imgUrl: '/static/img/avatar.png',
					voiceTime: 30,
					content: '/static/img/defaultHead.jpg'
				}, {
					uid: 7575838,
					type: 1,
					user: 'myself',
					imgUrl: '/static/img/friendhead.png',
					voiceTime: 30,
					content: '/static/img/defaultHead.jpg'
				}, {
					uid: 7575838,
					type: 2,
					user: 'others',
					imgUrl: '/static/img/avatar.png',
					content: '/static/img/defaultHead.jpg'
				}, {
					uid: 7575838,
					type: 2,
					user: 'myself',
					imgUrl: '/static/img/friendhead.png',
					content: '/static/img/defaultHead.jpg'
				}],
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
				 * 是否从通讯录进入
				 */
				is_from_address:false
			}
		},
		onLoad(e) {
			//获取录音权限相关
			recorderManager.onStop((res)=>{
				this.voicePath = res.tempFilePath;
				if(this.swiper === true){
					this.uploadVoice();
				}else {
					console.log('取消发送');
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
				innerAudioContext.src = this.voicePath;
				innerAudioContext.play();
			},
			/**
			 * 发送
			 */
			send(){
				console.log(this.content);
				this.content = '';
			},
			/**
			 * 点击加号
			 */
			plus(){
				console.log('plus++++++++++++++++++');
			},
			/**
			 * 滚动到最底部
			 */
			scrollToBottom(){
				this.scrollHeight = uni.getSystemInfoSync().windowHeight;
				let info2 = uni.createSelectorQuery().select(".conversationBottom");
				info2.boundingClientRect((data)=>{
					//屏幕高度-底部键盘区高度
					// #ifdef APP-PLUS
					this.scrollHeight = this.scrollHeight - data.height - 10;
					// #endif
					// #ifdef H5
					this.scrollHeight = this.scrollHeight - data.height + 50; 
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
			 * 预览图片
			 */
			preImg(src){
				console.log('预览图片',src);
			},
			/**
			 * 点击头像
			 */
			clickAvatar(src){
				console.log('点击头像',src)
			},
			/**
			 * 播放语音
			 */
			playVoice(src){
				console.log('播放语音',src);
				// innerAudioContext.src = item.src;
				// innerAudioContext.play();
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
				        recorderManager.start();
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
