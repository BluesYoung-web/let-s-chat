<template>
	<!-- 好友列表界面 -->
	<view>
		<!-- 搜索框 -->
		<view class="search flex flex-jc bg-fff pd-tp20 pd-bt20">
			<search-input width="600upx" border="none" backgroundColor="#efeff4" bdRadius="50upx" placeholder="输入好友名称"  @getInputMsg="getInputMsg"></search-input>
		</view>
		<!-- 常用联系人列表 -->
		<close-friend :closeFriend="closeFriend" @toFriendInfo="toFriendInfo"></close-friend>
		<!-- 好友列表 -->
		<view class="bg-fff pd-tp20" v-if="friendsList.length > 0">
			<span class="contacts-text">好友</span>
			<address-item :friendsList="friendsList" @toFriendInfo="toFriendInfo"></address-item>
		</view>
	</view>
</template>

<script>
	import data from '@/data.js';
	import closeFriend from '@/components/young-close-friend/young-close-friend.vue';
	import searchInput from '@/components/young-search-input/young-search-input.vue';
	import addressItem from '@/components/young-address-item/young-address-item.vue';
	export default {
		components: {
			closeFriend,
			searchInput,
			addressItem
		},
		data() {
			return {
				/**
				 * 好友列表
				 */
				friendsList: [],
				/**
				 * 最近联系人
				 */ 
				closeFriend: [{
					avatar: '/static/img/defaultHead.jpg',
					uid: 10
				}, {
					avatar: '/static/img/finds_01.jpg',
					uid: 12
				}, {
					avatar: '/static/img/finds_02.jpeg',
					uid: 13
				}, {
					avatar: '/static/img/avatar.png',
					uid: 14
				}],
			}
		},
		/**
		 * 监听设置按钮的点击事件
		 */
		onNavigationBarButtonTap(e) {
			// 跳转到搜索用户页面
			uni.navigateTo({
				url: `../addressSubpackage/addFriends`,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
			/**
			 * 前往好友资料页面
			 */
			toFriendInfo(uid) {
				console.log(uid);
			},
			/**
			 * 根据输入框前端筛选好友
			 */
			getInputMsg(e){
				console.log(e);
			}
		},
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";

	// page {
	// 	background-color: #FFFFFF;
	// }
	.search{
		width: 750upx;
		background-color: #FFFFFF;
	}
	
	.contacts-text{
		font-size: 20upx;
		color: #344955;
		margin-left: 30upx;
	}
</style>
