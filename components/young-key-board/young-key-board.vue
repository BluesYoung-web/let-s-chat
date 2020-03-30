<template>
	<view class="ct">
		<!-- 语音/文字输入 -->
		<view class="voice" @tap="inputChange">
			<image class="voice-img" src="/static/img/conversation/keyboard.png" mode="" v-if="isVoice"></image>
			<image class="voice-img" src="/static/img/conversation/voice.png" mode="" v-else></image>
		</view>
		<!-- 消息输入框 -->
		<view class="keyboardInput">
			<!-- 语音输入 -->
			<button v-if="isVoice" type="default" class="keyboardInput-button"
			@longpress="startRecord" @touchstart="cancelVoice" @touchend="endRecord">按住 说话</button>
			<!-- 文字输入 -->
			<textarea :auto-focus="!isVoice" :focus="!isVoice" class="keyboardInput-textarea"
			v-model="ct" auto-height="true" v-else type="text" @tap="inputFocus" 
			@input="$emit('getInputMsg', $event.target.value)"/>
		</view>
		<!-- 取消语音弹框 -->
		<view class="cancelVoice" v-show="pressActive">
			<view class="flex flex-jc flex-vc" style="width: 100%;height: 200upx;">
				<image class="cancelVoice-image" src="/static/img/cancelVoice.png" mode=""></image>
			</view>	
			<view class="flex flex-jc" style="width: 100%;height: 50upx;">
				<text>向上滑动，取消发送</text>
			</view>		
		</view>
		<!-- 表情键盘按钮 -->
		<view class="faces" @tap="showEmoji">
			<image class="voice-img" src="/static/img/face.png" mode=""></image>
		</view>
		<!-- 消息发送按钮/加号 -->
		<view class="messageSend" v-if="content.length > 0">
			<image src="/static/img/send.png" mode=""
			@tap="clickSend" class=" messageSend-image"></image>
		</view>
		<view class="plus" v-else>
			<image src="/static/img/conversation/plus.png"
			@tap="clickPlus" class="plus-img"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'keyBoard',
		props: {
			isVoice: {
				type: Boolean,
				default: false
			},
			content: {
				type: String,
				default: ''
			},
			pressActive: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				ct: ''
			}
		},
		watch: {
			content(newValue, oldValue) {
				this.ct = newValue;
			}
		},
		methods:{
			inputChange(){
				this.$emit('inputChange');
			},
			startRecord(){
				this.$emit('startRecord');
			},
			cancelVoice(e){
				this.$emit('cancelVoice', e);
			},
			endRecord(e){
				this.$emit('endRecord', e);
			},
			inputFocus(){
				this.$emit('inputFocus');
			},
			showEmoji(){
				this.$emit('showEmoji');
			},
			clickSend(){
				this.$emit('send');
			},
			clickPlus(){
				this.$emit('plus');
			}
		}
	}
</script>

<style>
	.ct{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.voice{
		width: 120upx;
		display: flex;
		justify-content: center;
	}
	.voice-img{
		width: 70upx;
		height: 70upx;
	}
	.cancelVoice{
		width: 250upx;
		height: 250upx;
		color: #ffffff;
		font-size: 25upx;
		background-color: #edf0f2;
		position: fixed;
		bottom: 500upx;
		left: 250upx;
		z-index: 5;
	}
	.cancelVoice-image{
		width: 200upx;
		height: 200upx;
	}
	.keyboardInput{
		background-color: #FFFFFF;
		border: 1upx solid #344955;
		width: 400upx;
		border-radius: 15upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.keyboardInput-textarea{
		width: 400upx;
		min-height: 40upx;
		max-height: 200upx;
		font-size: 32upx;
		line-height: 40upx;
		padding: 10upx;
	}
	.keyboardInput-button{
		width: 400upx;
		height: 65upx;
		line-height: 65upx;
	}
	.faces{
		width: 100upx;
		margin-left: 10upx;
		display: flex;
		justify-content: center;
	}
	.messageSend{
		margin-left: 20upx;
		height: 70upx;
		width: 70upx;
		border: 1upx solid #344955;
		border-radius: 50%;
		background-color: #F9AA33;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.messageSend-image{		
		height: 35upx;
		width: 35upx;
	}
	.plus{
		margin-left: 20upx;
		margin-bottom: -10upx;
	}
	.plus-img{
		width: 65upx;
		height: 65upx;
	}
	.flex {
		display: box; /* OLD - Android 4.4- */
		display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
		display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
		display: -ms-flexbox; /* TWEENER - IE 10 */
		display: -webkit-flex; /* NEW - Chrome */
		display: flex;

	}
	/* 垂直居中 */
	.flex-vc {
		/* 09版 */
		-webkit-box-align: center;
		/* 12版 */
		-webkit-align-items: center;
		-moz-align-items: center;
		-ms-align-items: center;
		-o-align-items: center;
		align-items: center;
	}

	.flex-jc { 
		justify-content: center;
	}
</style>
