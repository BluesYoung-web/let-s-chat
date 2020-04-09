<template>
	<view>
		<!-- 自定义导航栏组件 -->
		<uni-nav-bar leftIcon="arrowleft" backgroundColor="#344955" color="white"
		@clickLeft="goBack" @clickRight="clickSure">
			<view class="leftTitle">邀请好友</view>
			<view class="" slot="right">
				<button type="default" class="button" :class="canSure ? 'sure' : 'btn'">确定{{userNum > 0 ? `(${userNum})` : ''}}</button>
			</view>
		</uni-nav-bar>
		<!-- 筛选搜索框 -->
		<view class="search flex flex-jc bg-fff pd-tp20 pd-bt20">
			<search-input width="600upx" border="none" 
			backgroundColor="#efeff4" 
			bdRadius="50upx" placeholder="输入好友名称"  
			@getInputMsg="getInputMsg"
			type="createChatRoom"></search-input>
		</view>
		<!-- 好友列表 -->
		<view class="flist">
			<address-item type="createChatRoom" :friendsList="friendsList"
			@checkChange="checkChange"></address-item>
		</view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import addressItem from "@/components/young-address-item/young-address-item.vue";
	import searchInput from '@/components/young-search-input/young-search-input.vue';
	import data from '@/data.js';
	export default {
		/**
		 * 调用的组件
		 */
		components: {
			uniNavBar,
			addressItem,
			searchInput
		},
		data(){
			return {
				/**
				 * 邀请进入的聊天室id
				 */
				roomId: null,
				/**
				 * 已经在聊天室内的用户
				 */
				users: [],
				/**
				 * 当前用户信息
				 */
				user: {},
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
				friendsList: [],
				/**
				 * 好友列表备份
				 */
				allFriends: [],
				/**
				 * 已选择的好友uid数组
				 */
				checked: [],
			}
		},
		onLoad(e){
			this.roomId = e.roomId;
			data.chat.get_room_info({
				roomId: this.roomId,
				success: (res) => {
					this.users = res.users;
				}
			});
			data.user.get_info({
				success: (res) => {
					this.user = res;
				}
			});
		},
		onShow() {
			this.friendsList = [];
			this.allFriends = [];
			data.friend.get_list({
				force: true,
				success: (dt) => {
					for(let item of dt){
						if (!this.users.includes(item)) {
							data.friend.get_info({
								uid: item,
								success: (tp) => {
									this.allFriends.push(tp);
									this.friendsList.push(tp);
								},
								fail: (code, err) => {
									console.log(code, err);
								}
							});
						}
					}
				},
				fail: (code, err) => {
					console.log(code, err);
				}
			});
		},
		watch: {
			checked(newValue, oldValue) {
				this.changeSureStatus();
			}
		},
		methods:{
			/**
			 * 返回
			 */
			goBack(){
				uni.navigateBack();
			},
			/**
			 * 点击确定
			 */
			clickSure(){
				if(this.canSure){
					// 发送请求
					data.chat.invite({
						roomId: this.roomId,
						users: this.checked,
						success: () => {
							uni.showToast({
								title: '已邀请对方进群'
							});
							uni.reLaunch({
								url: '/pages/tabBar/message'
							});
						}
					});
				}
			},
			/**
			 * 选择变化
			 */
			checkChange(arr){
				console.log((arr))
				this.checked = arr;
			},
			/**
			 * 改变确定按钮的状态
			 */
			changeSureStatus(){
				this.userNum = this.checked.length;
				if(this.checked.length > 0){
					this.canSure = true;
				}else{
					this.canSure = false;
				}
			},
			/**
			 * 获取搜索框中的值
			 */
			getInputMsg(e){
				this.friendsList = this.allFriends.filter((item) => item.nick.includes(e));
			}
		},
	}
</script>

<style>
	.flist{
		position: absolute;
		top: 260upx;
	}
	/* 左侧标题 */
	.leftTitle{
		position: relative;
		left: -60upx;
	}
	/* 右侧按键 */
	.button{
		position: relative;
		font-size: 40upx;
		width: 120upx;
		height: 70upx;
		line-height: 70upx;
		margin-right: 60upx;
	}
	.btn{
		background-color: #C8C7CC !important;
		color: #aaa !important;
	}
	.sure{
		background-color: #3CC51F !important;
		color: #FFFFFF !important;
		margin-right: 100upx !important;
		width: 180upx !important;
	}
	/* 搜索 */
	.search{
		width: 750upx;
		background-color: #FFFFFF;
	}
</style>