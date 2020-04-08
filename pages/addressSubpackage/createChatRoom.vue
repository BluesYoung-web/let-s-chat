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
		<!-- 弹出框 -->
		<input-prompt :visible="promptVisible" title="请输入群聊名称" placeholder="请输入群聊名称" :defaultValue="defaultName" @cancel="clickPromptCancel" @confirm="clickPromptConfirm" mainColor="#318DFE">
		</input-prompt>
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
	import inputPrompt from '@/components/young-input-prompt/young-input-prompt.vue';
	import searchInput from '@/components/young-search-input/young-search-input.vue';
	import data from '@/data.js';
	export default {
		/**
		 * 调用的组件
		 */
		components: {
			uniNavBar,
			addressItem,
			inputPrompt,
			searchInput
		},
		data(){
			return {
				/**
				 * 是否显示弹框
				 */
				promptVisible: false,
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
				/**
				 * 默认群聊名称
				 */
				defaultName: ''
			}
		},
		onLoad(){
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
						data.friend.get_info({
							uid: item,
							success: (dt) => {
								this.allFriends.push(dt);
								this.friendsList.push(dt);
							},
							fail: (code, err) => {
								console.log(code, err);
							}
						});
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
					this.promptVisible = true;
					this.checked.map((a) => {
						this.friendsList.map((item) => {
							if(item.uid == a){
								this.defaultName += item.nick + '、';
							}
						});
					});
					this.defaultName = this.defaultName.split('');
					this.defaultName.pop();
					this.defaultName = this.defaultName.join('');
					this.defaultName =this.user.nick + '、' + this.defaultName + '的群聊';
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
			 * 确认
			 */
			clickPromptConfirm(val){
				// 向服务器发送请求。。。
				let temp = {
					type: 1,
					title: this.defaultName,
					users: this.checked
				}
				data.chat.create_room({
					data: temp,
					success: () => {
						uni.showToast({
							title: "群聊创建成功"
						});
						this.defaultName = '';
						uni.reLaunch({
							url: '/pages/tabBar/message'
						});
					},
					fail: (code, err) => {
						console.log(code, err);
					}
				});
			},
			/**
			 * 取消
			 */
			clickPromptCancel(){
				this.defaultName = '';
				this.promptVisible = false;
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
