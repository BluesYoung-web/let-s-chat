<template>
	<view>
		<!-- 常用联系人列表 大于0时才显示 -->
		<view class="top-contacts" v-if="closeFriend.length>0">
			<view class="top-contacts-text">
				<span>常用联系人</span>
			</view>
			<!-- 后限制条件改为最近联系好友，消息发送时间 -->
			<view class="top-contacts-head" v-for="(friend,index) in closeFriend" :key="index">
				<image v-if="index < 4" :src="friend.avatar" mode="" @tap="toFriendInfo(friend)"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		/**
		 * 组件名称
		 */
		name: 'closeFriend',
		/**
		 * 组件参数
		 */
		props: {
			closeFriend: {
				type: Array,
				default(){
					return []
				}
			}
		},
		methods: {
			toFriendInfo(item){
				this.$emit('toFriendInfo', item);
			}
		}
	}
</script>

<style>
	.top-contacts {
		height: 240upx;
		padding-left: 30upx;
		padding-top: 20upx;
		background-color: #FFFFFF;
	}
	.top-contacts-text {
		font-size: 20upx;
		color: #344955;
		height: 50upx;
	}
	.top-contacts-head image {
		float: left;
		height: 150upx;
		width: 150upx;
		margin-right: 25upx;
	}
</style>
