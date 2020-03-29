<template>
	<!-- 对话页面 -->
	<view>
			<scroll-view scroll-y="true" :scroll-top="scrollTop" class="conversationContent" :style="{height:scrollHeight + 'px'}">
				<view class="scroll" @tap="takeBack">
					<view v-for="(item,index) in messages" :key="index">
						<view class="messageTime" v-if="item.ifShow">
							<text>{{item.showTime}}</text>
						</view>
						<view v-if="item.sign==='other'" class="message friendMessage">
							<view class="messageHead" @tap="toFriendInfo">
								<image :src="item.head" mode=""></image>
							</view>
							<view class="messageContent">
								<text>{{item.content}}</text>
							</view>
						</view>
						<view v-if="item.sign==='otherVoice'" class="message friendMessage">
							<view class="messageHead" @tap="toFriendInfo">
								<image :src="item.head" mode=""></image>
							</view>
							<view class="messageContent flex flex-js flex-vc" style="background-color: #95ec69;" @tap="playVoice(item)">
								<text>{{item.intervalTime}}</text>
								<image src="/static/img/voiceMessage.png" style="height: 50upx;width: 50upx;"></image>
							</view>

						</view>
						<view v-if="item.sign==='me'" class="message myMessage">
							<view class="messageContent" style="background-color: #95ec69;">
								<text>{{item.content}}</text>
							</view>
							<view class="messageHead" @tap="toMyInfo">
								<image :src="item.head" mode=""></image>
							</view>
						</view>
						<view v-if="item.sign==='meVoice'" class="message myMessage">
							<view class="messageContent flex flex-js flex-vc" style="background-color: #95ec69;" @tap="playVoice(item)">
								<text>{{item.intervalTime}}</text>
								<image src="/static/img/voiceMessage.png" style="height: 50upx;width: 50upx;"></image>
							</view>
							<view class="messageHead" @tap="toMyInfo">
								<image :src="item.head" mode=""></image>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<!-- 底部文字语言输入框 -->
			<view class="conversationBottom" :style="'bottom: '+ bottom +'upx'">
				<!-- 输入键盘组件 -->
				<key-board :isVoice="isVoice" :content="content" 
				@getInputMsg="getInputMsg" @inputChange="inputChange"
				@showEmoji="showEmojiKeyBoard" @inputFocus="takeBack"
				@send="send" @plus="plus"></key-board>
			</view>
		<!-- 取消语音弹框 -->
		<view class="cancelVoice" v-show="pressActive">
			<view class="flex flex-jc flex-vc" style="width: 100%;height: 200upx;">
				<image src="/static/img/cancelVoice.png" mode=""></image>
			</view>	
			<view class="flex flex-jc" style="width: 100%;height: 50upx;">
				<text>向上滑动，取消发送</text>
			</view>		
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
	export default{
		components: {
			emojiInput,
			keyBoard
		},
		mounted() {
			this.scrollHeight = uni.getSystemInfoSync().windowHeight;
			let info2 = uni.createSelectorQuery().select(".conversationBottom");
			info2.boundingClientRect((data)=>{
				this.scrollHeight =this.scrollHeight - data.height;//屏幕高度-底部键盘区高度
			}).exec();
			let info = uni.createSelectorQuery().select(".scroll");
				info.boundingClientRect((data)=>{
				this.scrollTop = data.height - this.scrollHeight;
			}).exec();
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
				scrollHeight:'',
				scrollTop:0,
				messages:[
					// {
					// 	sign:'other',
					// 	head:'../../static/img/avatar.png',
					// 	content:'今天晚上8点，五排组起来',
					// 	time:'1分钟前'
					// },
					// {
					// 	sign:'me',
					// 	head:'../../static/img/avatar.png',
					// 	content:'没问题',
					// 	time:'刚刚'
					// },
					// {
					// 	"sign":"otherVoice",
					// 	"head":"http://192.168.10.136/img/1576831759230.png",
					// 	"content":"语音",
					// 	"realContent":"http://192.168.10.136/audio/1577179862943.aac",
					// 	"time":1577179866000,
					// 	"intervalTime":3,
					// 	"showTime":"17:31:06",
					// 	"ifShow":true,
					// }
				],
				content:'',//消息输入内容
				pressActive:false, //是否弹出语音取消框
				bottom:0,  //键盘高度后面获取
				voicePath: '',//录音
				intervalTime: 0,
				timer: null,
				voice:'',
				// 控制输入框聚焦
				txtInput:false,
				// 用户uid
				// 是否从通讯录进入
				is_from_address:false
			}
		},
		computed:{
			intIntervalTime() {
			    // 用于显示整数的秒数
			    return Math.round(this.intervalTime);
			}
		},
		onLoad(e) {
			//获取录音权限相关
			recorderManager.onStop((res)=>{
				this.voicePath = res.tempFilePath;
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
			 * 发送
			 */
			send(){
				console.log(this.content);
			},
			/**
			 * 点击加号
			 */
			plus(){
				console.log('plus++++++++++++++++++');
			},
			getScrollTop(){
				uni.getSystemInfo({
					success: (res)=> {
						this.scrollHeight = res.windowHeight;//获取屏幕高度
						let info2 = uni.createSelectorQuery().select(".conversationBottom");
						info2.boundingClientRect((data)=>{
							this.scrollHeight =this.scrollHeight - data.height;//屏幕高度-底部键盘区高度
						}).exec();
						let info = uni.createSelectorQuery().select(".scroll");
						info.boundingClientRect((data)=>{
							this.scrollTop = data.height - this.scrollHeight;
						}).exec();
					}
				});
				return this.scrollTop;
			},
			/**
			 * 输入表情
			 */
			showFaces(item){
				this.content += item;
			},
			//前往朋友资料页面
			toFriendInfo(){
				let uid = this.fuid
				uni.navigateTo({
					url: `/pages/addressSubpackage/friendsInfo?uid=${uid}&isF=true`,
				});
			},
			//前往我的界面
			toMyInfo(){
				uni.switchTab({
					url: '/pages/tabBar/my',
				});
			},
			// 长按开始录音，取消录音提示框出现
			startRecord() {				
				this.timer = setInterval(() => {
				    this.intervalTime += 0.5;
					if (this.intervalTime >= 0.5 && !this.pressActive) {
				        //如果用户录制的时间太短,就不会去开启录音, 因为有个bug: recorderManager.stop()在短时间内开启在关闭的话,实际上他还在不停地录音,不知道你们有没有遇到过
        		        console.log("开始录音");
 			            this.pressActive=true;
				        this.intervalTime = 0;
				        recorderManager.start();
				    }
				}, 500);
			},
			// 松开手指，录音结束，取消录音提示框消失
			endRecord() {				
				clearInterval(this.timer);
				recorderManager.stop();
				console.log('录音结束');
				this.pressActive = false;
				setTimeout(()=>{
					const voice = this.voicePath;
					const intervalTime = this.intervalTime;
					const time=Date.parse(new Date);
					// let data={
					// 	sign:'meVoice',
					// 	intervalTime:intervalTime,
					// 	head:this.avatarUrl,
					// 	content:"语音",
					// 	realContent:voice,
					// 	time:time,
					// 	showTime:null
					// };
					// this.messages.push(data);
					// // 处理时间显示
					// this.messages=tools.timeProcess(this.messages);
					// // 语音上传到服务器
					// let task = plus.uploader.createUpload(`${this.serverUrl}?op=upload&file=audio`,{},(t,status)=>{
					// 	if(t.state==4 && status==200){
					// 		data.realContent=t.responseText;
					// 		if (this.is_open_socket) {
					// 			this.sendMsg(this.account, this.fuid, data, this.socketTask);
					// 		}
					// 	}
					// });
					// task.addFile(voice,{key:"audio"});
					// task.start();
				}, 500);
			},
			playVoice(item){
				innerAudioContext.src = item.realContent;
				innerAudioContext.play();
			}
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.conversationContent{
		width: 100%;
	}
	.cancelVoice{
		width: 250upx;
		height: 250upx;
		color: @colorF;
		font-size: 25upx;
		background-color: @bgcolor;
		position: fixed;
		bottom: 200upx;
		left: 250upx;
		z-index: 5;
	}
	.cancelVoice image{
		width: 200upx;
		height: 200upx;
	}
	.facesHead{
		height: 80upx;
		background-color: @colorF;
	}
	.type{
		width: 80upx;
		height: 80upx;
		float: left;
	}
	.type image{
		width: 50upx;
		height: 50upx;
		border-radius: 50%;
	}
	.bg{
		background-color: @codeBorder;
	}
	// .type image:hover{
	// 	background-color: @codeBorder;
	// }
	.backspace{
		width: 80upx;
		height: 80upx;
		float: right;
	}
	.backspace image{
		width: 60upx;
		height: 60upx;
	}
	.facesContent{
		height: 520upx;
	}
	.facesBox{
		width: 100%;
		height: 600upx; //后期与键盘高度统一
		background-color: @bgcolor;
		position: fixed;
		bottom: 0;
	}
	.face{
		width: 83upx;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		display: inline-block;
	}
	.messageTime{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		width: 100%;
	}
	.messageTime text{
		font-size: 20upx;
		color: @msgTimeColor;
	}
	.message{
		width: 100%;
		display: flex;
		border-bottom: 20upx solid @colorF;
	}
	.friendMessage{
		justify-content: flex-start;
		padding-right: 200upx;
	}
	.myMessage{
		justify-content: flex-end;
		padding-left: 200upx;
	}
	.messageContent{
		background-color: @bgcolor;
		display: flex;
		border-radius: 10upx;
		/* max-width: 500upx; */
		height: auto;
	}
	.messageContent text{
		font-size: 25upx;
		margin: 20upx 10upx;
		
	}
	.messageContent image{
		margin-right: 10upx;
	}
	.messageHead{
		display: flex;
		justify-content: center;
		padding: 0 20upx;
	}
	.messageHead image{
		width: 80upx;
		height: 80upx;
	}
	.conversationBottom{
		position: fixed;
		width: 100%;
		background-color: @codeBorder;
		padding-top: 10upx;
		padding-bottom: 20upx;
	}
</style>
