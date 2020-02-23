<template>
	<view>
		<!-- 自定义导航栏组件 -->
		<uni-nav-bar leftIcon="arrowleft" backgroundColor="#344955" color="white"
		@clickLeft="goBack" @clickRight="clickSure">
			<view class="leftTitle">发起群聊</view>
			<view class="" slot="right">
				<button type="default" class="button" :class="canSure ? 'sure' : 'btn'">确定{{userNum > 0 ? `(${userNum})` : ''}}</button>
			</view>
		</uni-nav-bar>
		<!-- 好友列表 -->
		<address-item type="createChatRoom" :friendsList="friendsList"></address-item>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import addressItem from "@/components/young-address-item/young-address-item.vue";
	export default {
		/**
		 * 调用的组件
		 */
		components: {
			uniNavBar,
			addressItem
		},
		data(){
			return {
				/**
				 * 是否可以点击按钮
				 */
				canSure: false,
				/**
				 * 选择的群聊人数
				 */
				userNum: 0,
				/**
				 * 好友列表
				 */
				friendsList: [{
					avatar: '/static/img/defaultHead.jpg',
					uid: 11,
					nick: '张三丰'
				}, {
					avatar: '/static/img/finds_01.jpg',
					uid: 12,
					nick: '张无忌'
				}, {
					avatar: '/static/img/finds_02.jpeg',
					uid: 13,
					nick: '张翠山'
				}, {
					avatar: '/static/img/avatar.png',
					uid: 14,
					nick: '张召忠'
				}],
			}
		},
		methods:{
			/**
			 * 返回
			 */
			goBack(){
				console.log("0000000000");
				// uni.navigateBack();
			},
			/**
			 * 点击确定
			 */
			clickSure(){
				if(this.canSure){
					console.log("99999999999");
				}
			}
		}
	}
</script>

<style>
	/* 左侧标题 */
	.leftTitle{
		position: relative;
		left: -60upx;
	}
	/* 右侧按键 */
	button{
		position: relative;
		font-size: 40upx;
		width: 120upx;
		height: 70upx;
		line-height: 70upx;
		margin-right: 60upx;
	}
	.btn{
		background-color: #C8C7CC;
		color: #aaa;
	}
	.sure{
		background-color: #3CC51F;
		color: #FFFFFF;
		margin-right: 100upx;
		width: 180upx;
	}
</style>
