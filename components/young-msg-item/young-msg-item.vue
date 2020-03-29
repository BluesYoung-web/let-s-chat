<!-- 自定义消息组件 -->
<template>
	<view>
		<view class="m-item" :id="'message'+id">
			<!-- 时间 -->
			<view class="time width-750 flex flex-jc mg-tp20" v-if="message.time">
				<text class="ft-26 color-666">{{message.time}}</text>
			</view>
			
			<!-- ------------文字消息-------------- -->
			<view class="" v-if="message.type == 0">
				<view class="flex flex-direction-row width-750 flex-as pd-lt30 mg-tp30" v-if="message.user == 'others'">
					<view class="">
						<image class="head_icon" :src="message.imgUrl" mode="aspectFill"></image>
					</view>
					<view class="left-Textcontent">
						<view class="">
							{{message.content}}
						</view>
					</view>
				</view>
				<view class="flex flex-direction-row width-750 flex-as pd-rt30 flex-je mg-tp30" v-if="message.user == 'myself'">
					<view class="right-Textcontent">
						<view class="">
							{{message.content}}
						</view>
					</view>
					<image class="head_icon" :src="message.imgUrl" mode="aspectFill"></image>
				</view>
			</view>

			<!-- ------------语音消息------------ -->
			<view class="" v-if="message.type == 1">
				<view class="flex flex-direction-row width-750 flex-as pd-lt30 mg-tp30" v-if="message.user == 'others'">
					<view class="">
						<image class="head_icon" :src="message.imgUrl" mode="aspectFill"></image>
					</view>
					<view class="left-Textcontent">
						<view class="">
							<image src="/static/img/voiceMessage.png" mode=""></image>
							<!-- <span class="iconfont">&#xe743;</span> -->
							<text class="mg-lt10">{{message.voiceTime}}'</text>
						</view>
					</view>
				</view>
				<view class="flex flex-direction-row width-750 flex-as pd-rt30 flex-je mg-tp30" v-if="message.user == 'myself'">
					<view class="right-Textcontent">
						<view class="">
							<text class="mg-rt10">{{message.voiceTime}}'</text>
							<!-- <span class="iconfont">&#xe743;</span> -->
							<image src="/static/img/voiceMessage.png" mode=""></image>
						</view>
					</view>
					<image class="head_icon" :src="message.imgUrl" mode="aspectFill"></image>
				</view>
			</view>

			<!-- ------------图片消息------------ -->
			<view class="" v-if="message.type == 2">
				<view class="flex flex-direction-row width-750 flex-as pd-lt30 mg-tp30" v-if="message.user == 'others'">
					<view class="">
						<image class="head_icon" :src="message.imgUrl" mode="aspectFill"></image>
					</view>
					<view class="leftImgMessage">
						<image :src="message.content"  @click="preImg(message.content)" mode="aspectFit"></image>
					</view>
				</view>
				<view class="flex flex-direction-row width-750 flex-as pd-rt30 flex-je mg-tp30" v-if="message.user == 'myself'">
					<view class="rightImgMessage">
						<image :src="message.content"  @click="preImg(message.content)" mode="aspectFit"></image>
					</view>
					<view class="">
						<image class="head_icon" :src="message.imgUrl"  mode="aspectFill"></image>
					</view>
				</view>
			</view>

			<!-- ------------系统消息------------ -->
			<view class="" v-if="message.type == 3">
				<view class="system width-750 flex flex-jc mg-tp20">
					<text class="ft-26 color-666">{{message.content}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'msgItem',
		data() {
			return {
				voiceTime: 4, //模拟事件长度
			}
		},
		methods: {
			preImg(imgUrl) {
				console.log(1)
				uni.previewImage({
					urls: [imgUrl],
					longPressActions: {
						itemList: ['保存图片'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			}
		},
		props: {
			message: {
				type: Object,
				default () {
					return {
						user: "others", //消息发送者： 包括myself-自己、others-其他人
						time: '2019-08-21 21:58', //如果time长度为0说明不显示时间
						type: 0, //消息类型： 包括0-文字消息、1-语音消息、2-图片、3-系统消息
						content: "/static/img/337C393466ABAB31425CE09E655515F9.png",
						imgUrl: "/static/img/finds_01.jpg"
					}
				}
			},
			id: {
				type: Number,
				default: 0
			}
		},
	}
</script>

<style>
	.pd-lt30{
		padding-left: 30upx;
	}
	.pd-rt30{
		padding-right: 30upx;
	}
	.mg-tp20{
		margin-top: 20upx;
	}
	.mg-tp30{
		margin-top: 30upx;
	}
	.mg-lt10{
		margin-left: 10upx;
	}
	.mg-rt10{
		margin-right: 10upx;
	}
	.ft-26{
		font-size: 26upx;
	}
	.color-666{
		color: #666666;
	}
	.width-750{
		width: 750upx;
	}
	.flex {
		display: box; /* OLD - Android 4.4- */
		display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
		display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
		display: -ms-flexbox; /* TWEENER - IE 10 */
		display: -webkit-flex; /* NEW - Chrome */
		display: flex;
	}
	.flex-as{
		align-items: flex-start;
	}
	.flex-jc { 
		justify-content: center;
	}
	.flex-je {
		justify-content: end;
	}
	.flex-direction-row{
		flex-direction: row;
	}
	.m-item {
		display: flex;
		flex-direction: column;
		width: 750upx;
	}

	.head_icon {
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
	}

	/* ------------文字消息样式------------- */
	.left-Textcontent {
		text-align: left;
		background: #FFFFFF;
		border-radius: 20upx;
		padding: 20upx;
		color: black;
		max-width: 400upx;
		word-break: break-all;
		margin-left: 30upx;
		position: relative;
		font-size: 30upx;
	}

	.left-Textcontent:before {
		border: 8px solid transparent;
		border-right: 8px solid #FFFFFF;
		left: -16px;
		top: 10px;
		width: 0;
		height: 0;
		position: absolute;
		content: ' '
	}

	.right-Textcontent {
		text-align: left;
		background: #03A7E4;
		border-radius: 20upx;
		padding: 20upx;
		color: white;
		max-width: 400upx;
		word-break: break-all;
		margin-right: 30upx;
		position: relative;
		font-size: 30upx;
	}

	.right-Textcontent:after {
		border: 8px solid transparent;
		border-left: 8px solid #03A7E4;
		right: -16px;
		top: 10px;
		width: 0;
		height: 0;
		position: absolute;
		content: ' '
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* ------------图片消息样式------------- */
	.leftImgMessage image, .rightImgMessage image {
		max-width: 400upx;
	}

	.leftImgMessage, .rightImgMessage {
		border-radius: 10upx;
		overflow: hidden;
		background-color: #FFFFFF;
	}

	.leftImgMessage {
		margin-left: 20upx;
	}

	.rightImgMessage {
		margin-right: 20upx;
	}

	.system{
		background-color: cyan;
	}
</style>
