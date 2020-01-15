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
			<!-- 获取scroll-view高度用 -->
			<!-- <view class="scrollBottom" style="height: 10upx;width: 100%;">
	</view> -->
		</scroll-view>
		<!-- 底部文字语言输入框 -->
		<view class="">
			<view class="conversationBottom" :style="'bottom: '+ bottom +'upx'">
				<!-- 语音消息按钮 -->
				<view class="voice" @tap="toStartRecord()">
					<image src="/static/img/voice.png" mode=""></image>
				</view>
				<!-- 消息输入框 -->
				<view class="keyboardInput">
					<!-- 文字输入 -->
					<textarea :focus="txtInput" @focus="getKeyboardHight" v-model="content" auto-height="true" v-if="inputActive" type="text"
					 @tap="inputFocus" />
					<!-- 语音输入 -->
				<button v-else type="default"  @longpress="startRecord" @touchend="endRecord">按 住 说 话</button>				
			</view>
			<!-- 表情键盘按钮 -->
			<view class="faces" @tap="showFacesBox()">
				<image src="/static/img/face.png" mode=""></image>
			</view>
			<!-- 消息发送按钮 -->
			<view class="messageSend" @tap="sendMessage()">
				<image src="/static/img/send.png" mode=""></image>
			</view>
		</view>
		
	</view>
	<!-- 取消语音弹框 -->
	<view class="cancelVoice" v-show="pressActive">
		<view class="flex flex-jc flex-vc" style="width: 100%;height: 200upx;">
			<image src="/static/img/cancelVoice.png" mode=""></image>
		</view>	
		<view class="flex flex-jc" style="width: 100%;height: 50upx;">
			<text>手指松开，取消发送</text>
		</view>		
	</view>
	<!-- 表情键盘 -->
	<view class="facesBox" v-show="show">
		<!-- 表情类型 -->
		<view class="facesHead" >
			<view class="type flex flex-vc flex-jc" v-for="(item,index) in type" :key="item" @tap="showType(index)">
				<image :class="active === index ? 'bg':''" :src="item"></image>
			</view>
			<!-- 回车-->
			<view class="backspace flex flex-vc flex-jc" @tap="backSpace">
				<image src="../../static/img/backspace.png" ></image>
			</view>
		</view>
		<!-- 表情内容 -->
		<view class="facesContent">					
			<scroll-view scroll-y="true" v-show="index==0" style="height: 500upx; ">
				
					<!-- style="height: 600upx;" -->
					<!-- <image :src="emoji" mode=""></image> -->
					<view class="face" v-for="(item,index) in faceList" :key="index" @tap="showFaces(item)">
						{{item}}
					</view>
					<!-- <uni-list>
						<uni-list-item style="width: 100upx;height: 100upx;" v-for="(item,index) in faceList" :key="index" title="" note="">{{item}}</uni-list-item>
					</uni-list> -->
			</scroll-view>
			<scroll-view scroll-y="true" v-show="index==1" style="height: 500upx;">
				<view class="face" v-for="(item,index) in foodList" :key="index" @tap="showFaces(item)">
					{{item}}
				</view>
				<!-- <view class="face" v-for="(item,index) in faceList" :key="index" @tap="showFaces(item)">
					1
				</view> -->
			</scroll-view>
		</view>
	</view>
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
	
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue";
	import {mapState,mapMutations} from 'vuex';
	import tools from '@/tools/tools.js';
	export default{
		components: {uniSegmentedControl},
		mounted() {
			this.scrollHeight = this.windowHeight;
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
				inputMsg:'',
				active:0,
				type:[ 
					'../../static/img/facetype.png',
					'../../static/img/food.png'
				],
				// emoji:'../../static/img/heart.png',
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
				index:0,  //初始表情类型
				pressActive:false, //是否弹出语音取消框
				bottom:0,  //键盘高度后面获取
				show:false,  //表情键盘是否出现
				//语音输入与文字输入切换
				inputActive:true, 
				voiceActive:false,
				voicePath: '',//录音
				intervalTime: 0,
				timer: null,
				voice:'',
				faceList:[],
				foodList:[],
				// 控制输入框聚焦
				txtInput:false,
				// 用户uid
				account:'',
				avatarUrl:'',
				// 好友uid
				fuid:'',
				// 是否从通讯录进入
				is_from_address:false
			}
		},
		computed:{
			...mapState(['tempInfo','userInfo','serverUrl','websocketUrl','socketTask','is_open_socket',
						'conversationMessage','conversationMessageList','windowHeight']),
			intIntervalTime() {
			    // 用于显示整数的秒数
			    return Math.round(this.intervalTime);
			}
		},
		onShow() {
		    if(this.conversationMessageList){
		    	for (let i in this.conversationMessageList) {
		    		if(this.fuid==this.conversationMessageList[i].account){
		    			this.messages=this.conversationMessageList[i].conversation;
		    		}
		    	}
		    	// 处理时间显示
		    	this.messages=tools.timeProcess(this.messages);
		    };
		},
		onLoad(e) {
			//表情获取
			for (let i in emoji) {
				this.faceList.push(emoji[i].char);
			};
			for (let i in emojiFood) {
				this.foodList.push(emojiFood[i].char);
			};
			// 从state获取用户信息
			if(this.userInfo){
				let tp=this.userInfo;
				this.account=tp.account;
				this.avatarUrl=tp.avatarUrl;
			}
			this.is_from_address=e.voiceActive ? true:false;
			console.log("进入会话页");
			if (e.voiceActive==0) {
				console.log("语音输入");
				this.inputActive=false;
				this.voiceActive=true;
				this.txtInput=false;
			}
			//获取录音权限相关
			recorderManager.onStop((res)=>{
				this.voicePath = res.tempFilePath;
			});
			// 接收f_uid
			if(e.f_uid){
				this.fuid=e.f_uid;
				// 修改导航栏
				uni.setNavigationBarTitle({
				    title: e.name
				});
				return;
				// 从服务器获取好友信息(后期可优化成从暂存获取)
				request.getUserInfo(this.fuid,(data)=>{
					let avatarUrl=data.avatarUrl;
					// 修改用户头像
					for (let i in this.messages) {
						if(this.messages[i].sign=='other' || this.messages[i].sign=='otherVoice'){
							this.messages[i].head=avatarUrl;
						}else if(this.messages[i].sign=='me' || this.messages[i].sign=='meVoice'){
							this.messages[i].head=this.avatarUrl;
						}
					}
				});
			}
			
		},
		onBackPress() {
			// 删除消息数
			this.clearMsgNum(this.fuid);
			// 暂存对话消息
			let temp={
				fid:this.fuid,
				messages:this.messages
			}
			this.addConversationMessage(temp);
			// 修改消息页面显示的content
			let content=this.messages[this.messages.length-1].content;
			let time=this.messages[this.messages.length-1].time;
			time=tools.showTime(time);
			let obj={
				account:this.fuid,
				content:content,
				time:time
			}
			this.changeContent(obj);
		},
		methods:{
			...mapMutations(['addConversationMessage','clearMsgNum','addMessageListFirst','changeContent']),
			takeBack(){
				this.show = false;
				this.bottom=0;
			},
			// 删除表情
			backSpace(){
				// console.log(this.content)
				let msg = this.content;
				msg=Array.from(msg);
				msg.pop();
				msg=msg.join("");
				// console.log(msg);
				this.content = msg;
			},
			// 表情类型选择
			showType(index){
				console.log(index)
				this.active=index
				if(index==0){
					this.index=0					
				}else if(index==1){
					this.index=1
				}
			},
			//获取屏幕高度显示朋友圈
			getScrollHeight(){
				uni.getSystemInfo({
					success: (res)=> {
						this.scrollHeight = res.windowHeight;//获取屏幕高度
					}
				});
				return this.scrollHeight
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
			// 发送数据
			sendMsg(id, friendid, Data, ws) {
				let Json = {
					'ID': id,
					'FID': friendid,
					'Data': Data,
					'Op':'privateChat'
				};
				ws.send({
					data: JSON.stringify(Json),
					success:()=> {
						console.log("消息发送成功");
					},
					fail:()=> {
						console.log("消息发送失败");
					},
				});
				//发送一条消息，消息始终在最底部
				this.scrollTop = this.getScrollTop();
				if(this.is_from_address){
					// 如果消息页面有对应的数组项
					for (let i in this.conversationMessageList) {
						if(this.conversationMessageList[i].account==this.tempInfo.account){
							return;
						}
					}
					// message页面添加数组项
					let msg={
						imgUrl:this.tempInfo.avatarUrl,
						username:this.tempInfo.name,
						time:Data.showTime,
						content:Data.content,
						right: 0,
						msgNum:0,
						account:this.tempInfo.account,
						intervalTime:Data.intervalTime,
						realContent:Data.realContent,
						conversation:this.messages
					}
					this.addMessageListFirst(msg);
				}
			},
			//获取键盘高度
			getKeyboardHight(e){
				let height = e.detail.height;
			},
			//消息发送
			sendMessage(){
				let msg = this.content;
				if(this.content!=''){
					const time=Date.parse(new Date);
					let data={
						sign:'me',
						head:this.avatarUrl,
						content:msg,
						time:time,
						showTime:null
					};
					this.messages.push(data);
					// 处理时间显示
					this.messages=tools.timeProcess(this.messages);
					if (this.is_open_socket) {
						this.sendMsg(this.account, this.fuid, data, this.socketTask);
					}
					this.content='';
				};
			},
			//输入表情
			showFaces(item){
				this.content = this.content + item
			},
			//从表情键盘恢复普通键盘输入
			inputFocus(){
				if(this.bottom==600){
					this.show=false;
					this.bottom=0;
				}
			},
			//显示表情键盘
			showFacesBox(){
				if(this.show==false){
					this.voiceActive=false;
					this.inputActive=true;
					this.show=true;
					this.bottom=600;
					
				}else if(this.show==true){
					this.show=false;
					this.bottom=0;
					
				}				
			},
			//前往朋友资料页面
			toFriendInfo(){
				let uid = this.fuid
				uni.navigateTo({
					url: `../addressSubpackage/friendsInfo/friendsInfo?uid=${uid}&isF=true`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			//前往我的界面
			toMyInfo(){
				console.log('aaa')
				uni.switchTab({
					url: '../tabBar/profile/profile',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			//点击录音图标显示开始录音按钮
			toStartRecord(){
				if(this.voiceActive==false){
					this.voiceActive=true;
					this.inputActive=false;
					this.show=false;
					this.bottom=0;
				}else if(this.voiceActive==true){
					this.voiceActive=false;
					this.inputActive=true
				}
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
					let data={
						sign:'meVoice',
						intervalTime:intervalTime,
						head:this.avatarUrl,
						content:"语音",
						realContent:voice,
						time:time,
						showTime:null
					};
					this.messages.push(data);
					// 处理时间显示
					this.messages=tools.timeProcess(this.messages);
					// 语音上传到服务器
					let task = plus.uploader.createUpload(`${this.serverUrl}?op=upload&file=audio`,{},(t,status)=>{
						if(t.state==4 && status==200){
							data.realContent=t.responseText;
							if (this.is_open_socket) {
								this.sendMsg(this.account, this.fuid, data, this.socketTask);
							}
						}
					});
					task.addFile(voice,{key:"audio"});
					task.start();
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
		width: @p100;
	}
	.cancelVoice{
		width: 2.5*@u100;
		height: 2.5*@u100;
		color: @colorF;
		font-size: 0.25*@u100;
		background-color: @bgcolor;
		position: fixed;
		bottom: 5*@u100;
		left: 2.5*@u100;
		z-index: 5;
	}
	.cancelVoice image{
		width: 2*@u100;
		height: 2*@u100;
	}
	.facesHead{
		width: @p100;
		height: 0.8*@u100;
		background-color: @colorF;
	}
	.type{
		width: 0.8*@u100;
		height: 0.8*@u100;
		float: left;
	}
	.type image{
		width: 0.5*@u100;
		height: 0.5*@u100;
		border-radius: 50%;
	}
	.bg{
		background-color: @codeBorder;
	}
	// .type image:hover{
	// 	background-color: @codeBorder;
	// }
	.backspace{
		width: 0.8*@u100;
		height: 0.8*@u100;
		float: right;
	}
	.backspace image{
		width: 0.6*@u100;
		height: 0.6*@u100;
	}
	.facesContent{
		height: 5.2*@u100;
	}
	.facesBox{
		width: @p100;
		height: 6*@u100; //后期与键盘高度统一
		background-color: @bgcolor;
		position: fixed;
		bottom: 0;
	}
	.face{
		width: 0.83*@u100;
		height: @u100;
		text-align: center;
		line-height: @u100;
		display: inline-block;
	}
	.messageTime{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 0.6*@u100;
		width: @p100;
	}
	.messageTime text{
		font-size: 0.2*@u100;
		color: @msgTimeColor;
	}
	.message{
		width: @p100;
		display: flex;
		border-bottom: 0.2*@u100 solid @colorF;
	}
	.friendMessage{
		justify-content: flex-start;
		padding-right: 2*@u100;
	}
	.myMessage{
		justify-content: flex-end;
		padding-left: 2*@u100;
	}
	.messageContent{
		background-color: @bgcolor;
		display: flex;
		border-radius: 0.1*@u100;
		/* max-width: 500upx; */
		height: auto;
	}
	.messageContent text{
		font-size: 0.25*@u100;
		margin: 0.2*@u100 0.1*@u100;
		
	}
	.messageContent image{
		margin-right: 0.1*@u100;
	}
	.messageHead{
		display: flex;
		justify-content: center;
		padding: 0 0.2*@u100;
	}
	.messageHead image{
		width: 0.8*@u100;
		height: 0.8*@u100;
	}
	.conversationBottom{
		position: fixed;
		/* z-index: 1; */
		width: @p100;
		/* height:100upx; */
		display: flex;
		align-items: flex-end;
		background-color: @codeBorder;
		padding-top: 0.1*@u100;
		padding-bottom: 0.2*@u100;
	}
	.voice{
		width: 1.2*@u100;
		display: flex;
		justify-content: center;
	}
	.voice image{
		width: 0.6*@u100;
		height: 0.6*@u100;
	}
	.keyboardInput{
		background-color: @colorF;
		border: 0.01*@u100 solid @codeBorder;
		width: 4*@u100;
		/* height: auto; */
		border-radius: 0.15*@u100;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.keyboardInput textarea{
		width: 4*@u100;
		min-height: 0.4*@u100;
		max-height: 1.5*@u100;
		font-size: 0.3*@u100;
		padding-top: 0.15*@u100;
		padding-bottom: 0.15*@u100;
		/* line-height: 65upx; */
	}
	.keyboardInput button{
		width: 4*@u100;
		height: 0.65*@u100;
		line-height: 0.65*@u100;
	}
	.faces{
		width: 1.1*@u100;
		display: flex;
		justify-content: center;
	}
	.faces image{
		width: 0.7*@u100;
		height: 0.7*@u100;
	}
	.messageSend{
		height: 0.7*@u100;
		width: 0.7*@u100;
		border: 1upx solid @codeBorder;
		border-radius: 0.5*@p100;
		background-color: @sendMsgBtn;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.messageSend image{		
		height: 0.35*@u100;
		width: 0.35*@u100;
	}
</style>
