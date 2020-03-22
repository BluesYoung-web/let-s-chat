<template>
	<!-- 好友列表界面 -->
	<view>
		<!-- 自定义导航栏 -->
		<uni-nav-bar title="通讯录" background-color="#344955" color="#ffffff"
		right-icon="plusempty" @clickRight="clickPlus"></uni-nav-bar>
		<!-- 下拉气泡菜单 -->
		<bubble-menu :ifShow="isShowbubble" x='342' y="5" theme="dark" 
		:popData="popData" @close="close" @clickMenu="clickMenu"></bubble-menu>
		<!-- 搜索框 -->
		<view class="search flex flex-jc bg-fff pd-tp20 pd-bt20">
			<search-input width="600upx" border="none" backgroundColor="#efeff4" bdRadius="50upx" placeholder="输入好友名称"  @getInputMsg="getInputMsg"></search-input>
		</view>
		<!-- 新朋友 -->
		<icon-list iconType="personadd-filled" color='#1BB723' title="新的朋友" 
		@click="toFriendCheck" :showRed="hasFriendCheck"></icon-list>
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
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import bubbleMenu from "@/components/young-bubble-menu/young-bubble-menu.vue";
	import closeFriend from '@/components/young-close-friend/young-close-friend.vue';
	import searchInput from '@/components/young-search-input/young-search-input.vue';
	import addressItem from '@/components/young-address-item/young-address-item.vue';
	import iconList from "@/components/young-icon-list/young-icon-list.vue";
	export default {
		components: {
			closeFriend,
			searchInput,
			addressItem,
			uniNavBar,
			bubbleMenu,
			iconList
		},
		onShow(){
			uni.$once('hasFriendCheck', () => {
				this.hasFriendCheck = true;
			});
			this.allFriendList = [];
			this.friendsList = [];
			data.friend.get_list({
				force: true,
				success: (dt) => {
					for(let item of dt){
						data.friend.get_info({
							uid: item,
							success: (dt) => {
								this.allFriendList.push(dt);
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
		onPullDownRefresh() {
			this.allFriendList = [];
			this.friendsList = [];
			data.friend.get_list({
				force: true,
				success: (dt) => {
					for(let item of dt){
						data.friend.get_info({
							uid: item,
							force: true,
							success: (dt) => {
								this.allFriendList.push(dt);
								this.friendsList.push(dt);
								setTimeout(() => {
									uni.stopPullDownRefresh();
								}, 100);
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
		data() {
			return {
				/**
				 * 好友列表
				 */
				friendsList: [],
				allFriendList: [],
				/**
				 * 最近联系人
				 */ 
				closeFriend: [],
				/**
				 * 是否显示气泡菜单
				 */
				isShowbubble: false,
				/**
				 * 菜单项
				 */
				popData: [{
					title: '发起群聊',
					icon: 'chatbubble-filled',
				}, {
					title: '添加朋友',
					icon: 'personadd-filled',
				}, {
					title: '扫一扫',
					icon: 'scan'
				}, {
					title: '分享给朋友',
					icon: 'upload'
				}, {
					title: '帮助与反馈',
					icon: 'email'
				}],
				hasFriendCheck: false
			}
		},
		methods: {
			/**
			 * 点击右上角加号
			 */
			clickPlus(){
				this.isShowbubble = true;
			},
			/**
			 * 关闭气泡菜单
			 */
			close(){
				this.isShowbubble = false;
			},
			/**
			 * 点击气泡菜单
			 */
			clickMenu(item){
				switch (item.title){
					case '发起群聊':
						this.toCreateChatRoom();
						break;
					case '添加朋友':
						this.toUserSearch();
						break;
					default:
						break;
				}
			},
			/**
			 * 去创建群聊
			 */
			toCreateChatRoom(){
				uni.navigateTo({
					url:"/pages/addressSubpackage/createChatRoom"
				});
			},
			/**
			 * 去搜索用户
			 */
			toUserSearch(){
				uni.navigateTo({
					url:"/pages/addressSubpackage/addFriends"
				});
			},
			/**
			 * 前往好友资料页面
			 */
			toFriendInfo(item) {
				uni.navigateTo({
					url:`/pages/addressSubpackage/friendsInfo?uid=${item.uid}`
				});
			},
			/**
			 * 根据输入框前端筛选好友
			 */
			getInputMsg(e){
				this.friendsList = this.allFriendList.filter((item) => item.nick.includes(e));
			},
			/**
			 * 去好友验证页面
			 */
			toFriendCheck(){
				this.hasFriendCheck = false;
				uni.hideTabBarRedDot({
					index: 1
				});
				uni.navigateTo({
					url:'/pages/addressSubpackage/friendCheck'
				});
			}
		},
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
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
