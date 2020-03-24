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
		onShow() {
			this.allFriends = JSON.parse(JSON.stringify(this.friendsList));
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
					this.defaultName ='与' + this.defaultName + '的群聊';
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
				this.defaultName = '';
				// 向服务器发送请求。。。
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
