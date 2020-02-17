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
	</view>
</template>

<script>
	export default {
		name: 'editItem',
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
			}
		}
	}
</script>

<style>
	@import url("./common.css");
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
		background-color: #FFFFFF;
		margin-top: 20upx;
	}
	.rightIcon{
		height: 30upx;
		width: 30upx;
		margin-left: 30upx;
	}
</style>
