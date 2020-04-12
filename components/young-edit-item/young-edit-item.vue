<template>
	<view class="">
		<!-- 头像（有title，有img，有right） -->
		<view v-if="type == 0 " class="avatarItem" @tap="openPopup">
			<text v-text="title"></text>
			<view class="flex flex-vc">
				<image class="avatar" :src="avatar" mode="aspectFill"></image>
				<image class="rightIcon" src="/static/img/arrow-right.png" mode=""></image>
			</view>
		</view>
		<!-- 昵称，签名等（有title，有content，有right） -->
		<!-- 设置选项（有title，没有content，有right） -->
		<view v-if="type == 1 " class="nameItem" @tap="toChange">
			<text v-text="title"></text>
			<view class="flex flex-ac">
				<text v-text="content" class="inline-block width-400 one-line-ellipsis text-right "></text>
				<image class="rightIcon" src="/static/img/arrow-right.png" mode=""></image>
			</view>
		</view>
		<!-- 账号（有title，有content，没有right） -->
		<view v-if="type == 2" class="accountItem" @longpress = "accountCopy">
			<text v-text="title"></text>
			<text v-text="content"></text>
		</view>
		<!-- 居中的按键 -->
		<view v-if="type == 3" class="signOutItem flex flex-hc flex-vc" @tap="openPopup">
			<text v-text="content"></text>
		</view>
		<!-- 好友验证 -->
		<view v-if="type == 4">
			<view  v-for="(item, index) in checkList" :key="index" class="flex flex-direction-row flex-vc flex-jsb width-750 height-120 pd-lr30">
				<img-cache defaultImg="/static/img/finds_01.jpg" :src="item.avatar"
				setStyle="width: 80upx; height: 80upx; border-radius: 50% !important;"></img-cache>
				<view class="width-600 flex flex-direction-row flex-jsb pd-lr20 h120 line-h120 bd-bt-gainsboro">
					<text class="ft-32">{{'好友请求-'+item.nick}}</text>
					<!-- 未处理 -->
					<view class="flex flex-direction-row flex-ac" v-if="!item.isChecked">
						<button class="btn color-1BB723 mg-rt20" @tap="clickYes(item)">同意</button>
						<button class="btn color-refuse" @tap="clickNo(item)">拒绝</button>
					</view>
					<!-- 已处理 -->
					<view class="color-ccc ft-26" v-else>
						<text v-if="item.isAgree == 1">您已同意好友请求</text>
						<text v-else>您已拒绝好友请求</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 粉丝互粉 -->
		<view v-if="type == 5">
			<view v-for="(item, index) in fansList" :key="index" class="flex flex-direction-row flex-vc flex-jsb width-750 height-120 pd-lr30">
				<img-cache defaultImg="/static/img/finds_01.jpg" :src="item.avatar"
				setStyle="width: 80upx; height: 80upx; border-radius: 50% !important;"
				@clickAvatar="clickUser(item)"></img-cache>
				<!-- 关注/取消关注 -->
				<view class="width-600 flex flex-direction-row flex-jsb pd-lr20 h120 line-h120 bd-bt-gainsboro">
					<text class="ft-32" @tap="clickUser(item)">{{item.nick}}</text>
					<view class="flex flex-direction-row flex-ac">
						<button class="btn color-1BB723" @tap="focus(item)" v-if="item.isFocus == 0">关注</button>
						<button class="btn color-refuse w240" @tap="disFocus(item)" v-else>取消关注</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import imgCache from '@/components/young-img-cache/young-img-cache.vue';
	export default {
		name: 'editItem',
		components:{
			imgCache
		},
		props: {
			type: {
				type: [String, Number],
				default : '1'
			},
			title: {
				type: String,
				default: "标题"
			},
			content: {
				type: [String, Number],
				default: ''
			},
			avatar: {
				type: String,
				default: ''
			},
			checkList: {
				type: Array,
				default(){
					return []
				}
			},
			fansList: {
				type: Array,
				default(){
					return []
				}
			}
		},
		methods:{
			openPopup(){
				this.$emit('poupChange');
			},
			toChange(){
				this.$emit('toChange');
			},
			accountCopy(){
				this.$emit('copy');
			},
			clickYes(item){
				this.$emit('yes', item);
			},
			clickNo(item){
				this.$emit('no', item);
			},
			focus(item){
				this.$emit('focus', item.uid);
			},
			disFocus(item){
				this.$emit('disFocus', item.uid);
			},
			clickUser(item){
				this.$emit('clickUser', item.uid);
			}
		}
	}
</script>

<style>
	/* 文字只显示一行，超出部分省略号 */
	.one-line-ellipsis{
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	}
	.mg-rt20{
		margin-right: 20upx;
	}
	.color-ccc{
		color: #ccc;
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
	/* 水平居中 */
	.flex-hc {
		/* 09版 */
		-webkit-box-pack: center;
		/* 12版 */
		-webkit-justify-content: center;
		-moz-justify-content: center;
		-ms-justify-content: center;
		-o-justify-content: center;
		justify-content: center;
	}
	/* 按行排列 */
	.flex-direction-row{
		flex-direction: row;
	}
	.flex-jsb { 
		justify-content: space-between;
	}
	.flex-ac { 
		align-items: center;
	}
	.width-750{
		width: 750upx;
	}
	.width-600{
		width: 600upx;
	}
	.width-80{
		width: 80upx;
	} 
	.height-120, .h120{
		height: 120upx;
	}
	.height-80{
		height: 80upx;
	} 
	.line-h120{
		line-height: 120upx;
	}
	.pd-lr30{
		padding: 0 30upx;
	}
	.pd-lr20{
		padding: 0 20upx;
	}
	.bd-rd50{
		border-radius: 50% !important;
	}
	.bd-bt-gainsboro{
		border-bottom: 1px solid #F1F1F1;
	}
	.ft-32{
		font-size:32upx;
	}
	.ft-26{
		font-size:26upx;
	}
	.avatarItem{
		width: 750upx;
		display: flex;
		align-items: center;
		color: #344955;
		padding-left: 20upx;
		background-color: white;
		justify-content: space-between;
		padding-right: 30upx;
		height: 200upx;
	}
	.avatar{
		width: 150upx;
		height: 150upx;
		line-height: 150upx;
		border-radius: 8upx;
	}
	.nameItem,.accountItem{
		width: 750upx;
		display: flex;
		align-items: center;
		color: #344955;
		padding-left: 20upx;
		background-color: white;
		justify-content: space-between;
		padding-right: 30upx;
		height: 100upx;
		margin-top: 20upx;
	}
	.signOutItem{
		height: 100upx;
		width: 750upx;
		background-color: #FFFFFF;
		margin-top: 20upx;
	}
	.rightIcon{
		height: 30upx;
		width: 30upx;
		margin-left: 30upx;
	}
	.color-1BB723{
		background-color: #1BB723;
		color: white;
	}
	.color-refuse{
		background-color: #ff3333;
		color: #F6F6F6;
	}
	.btn{
		height: 60upx;
		line-height: 60upx;
		width: 120upx;
	}
	.w240{
		width: 240upx;
	}
</style>
