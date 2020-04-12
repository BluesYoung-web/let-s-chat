<!-- 自定义消息组件 -->
<template>
	<view>
		<view class="m-item">
			<!-- 时间 -->
			<view class="time width-750 flex flex-jc mg-tp20" v-if="message.time">
				<text class="ft-26 color-666">{{message.time}}</text>
			</view>
			
			<!-- ------------文字消息-------------- -->
			<view class="" v-if="message.type == 0">
				<view class="flex flex-direction-row width-750 flex-as pd-lt30 mg-tp30" v-if="message.user == 'others'">
					<img-cache defaultImg="/static/img/finds_01.jpg" :src="message.imgUrl" 
					setStyle="width: 100upx; height: 100upx; border-radius: 10upx;"
					@clickAvatar="clickAvatar(message.uid)"></img-cache>
					<view class="left-Textcontent">
						{{message.content}}
					</view>
				</view>
				<view class="flex flex-direction-row width-750 flex-as pd-rt30 flex-je mg-tp30" v-if="message.user == 'myself'">
					<view class="right-Textcontent">
						{{message.content}}
					</view>
					<img-cache defaultImg="/static/img/finds_01.jpg" :src="message.imgUrl"
					setStyle="width: 100upx; height: 100upx; border-radius: 10upx;"
					@clickAvatar="clickAvatar(message.uid)"></img-cache>
				</view>
			</view>

			<!-- ------------语音消息------------ -->
			<view class="" v-if="message.type == 1">
				<view class="flex flex-direction-row width-750 flex-as pd-lt30 mg-tp30" v-if="message.user == 'others'">
					<img-cache defaultImg="/static/img/finds_01.jpg" :src="message.imgUrl"
					setStyle="width: 100upx; height: 100upx; border-radius: 10upx;"
					@clickAvatar="clickAvatar(message.uid)"></img-cache>
					<view class="left-Textcontent flex flex-direction-row flex-ac" @tap="playVoice(message.content)">
						<image class="voice-img" src="/static/img/voiceMessage.png" mode=""></image>
						<text class="mg-lt10 voice-txt">{{message.voiceTime + '"'}}</text>
					</view>
				</view>
				<view class="flex flex-direction-row width-750 flex-as pd-rt30 flex-je mg-tp30" v-if="message.user == 'myself'">
					<view class="right-Textcontent flex flex-direction-row flex-ac" @tap="playVoice(message.content)">
						<text class="mg-rt10 voice-txt">{{message.voiceTime + '"'}}</text>
						<image class="voice-img" src="/static/img/voiceMessage.png" mode=""></image>
					</view>
					<img-cache defaultImg="/static/img/finds_01.jpg" :src="message.imgUrl"
					setStyle="width: 100upx; height: 100upx; border-radius: 10upx;"
					@clickAvatar="clickAvatar(message.uid)"></img-cache>
				</view>
			</view>

			<!-- ------------图片消息------------ -->
			<view class="" v-if="message.type == 2">
				<view class="flex flex-direction-row width-750 flex-as pd-lt30 mg-tp30" v-if="message.user == 'others'">
					<img-cache defaultImg="/static/img/finds_01.jpg" :src="message.imgUrl"
					setStyle="width: 100upx; height: 100upx; border-radius: 10upx;"
					@clickAvatar="clickAvatar(message.uid)"></img-cache>
					<view class="left-Textcontent">
						<image :src="message.content"  class="content-img"
						@click="preImg(message.content)" mode="aspectFit"></image>
					</view>
				</view>
				<view class="flex flex-direction-row width-750 pd-rt30 flex-je mg-tp30" v-if="message.user == 'myself'">
					<view class="right-Textcontent">
						<image :src="message.content"  class="content-img"
						@click="preImg(message.content)" mode="aspectFit"></image>
					</view>
					<img-cache defaultImg="/static/img/finds_01.jpg" :src="message.imgUrl"
					setStyle="width: 100upx; height: 100upx; border-radius: 10upx;"
					@clickAvatar="clickAvatar(message.uid)"></img-cache>
				</view>
			</view>

			<!-- ------------系统消息------------ -->
			<view class="" v-if="message.type == 3">
				<view class="width-750 flex flex-jc mg-tp20">
					<text class="ft-26 color-ccc">系统消息：{{message.content}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import imgCache from '@/components/young-img-cache/young-img-cache.vue';
	export default {
		name: 'msgItem',
		components:{
			imgCache
		},
		props: {
			message: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		methods: {
			preImg(src) {
				this.$emit('preImg', src);
			},
			clickAvatar(uid){
				this.$emit('clickAvatar', uid);
			},
			playVoice(src){
				this.$emit('playVoice', src);
			}
		}
	}
</script>

<style>
	.content-img{
		width: 200upx;
		height: 200upx;
	}
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
	.color-ccc{
		color: #ccc;
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
	.flex-ac{
		align-items: center;
	}
	.flex-jc { 
		justify-content: center;
	}
	.flex-je {
		justify-content: flex-end;
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
		background: rgb(6, 216, 17);
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
		border-right: 8px solid rgb(6, 216, 17);
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

	.voice-img{
		width: 50upx;
		height: 50upx;
	}
	.voice-txt{
		font-size: 32upx;
	}
</style>
