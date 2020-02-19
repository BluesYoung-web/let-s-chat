<template>
	<!-- 通讯录界面 -->
	<view>
		
		<!-- 常用联系人列表 -->
		<view class="top-contacts" v-if="closeFriend.length>0">
			<view class="top-contacts-text">
				<span>常用联系人</span>
			</view>
			<!-- 后限制条件改为最近联系好友，消息发送时间 -->
			<view class="top-contacts-head" v-for="(friend,index) in closeFriend" v-bind:key="index">
				<image  :src="friend.imgUrl" mode="" @tap="toFriendsInfo(friend.account)"></image>
			</view>
		</view>
		<!-- 姓氏查找框 -->
		<view class="username-search">
			<view v-for="(item,index) in searchWord" :key="index">
				<view class="word-search block" :ref="item" @tap="nameSearch(index)">
					{{item}}
				</view>
			</view>
		</view>
		<!-- 已经对好接口的好友列表 -->
		<view class="friends-lists">
			<view class="" v-for="(flist,index) in friendsLists" :key="index">
				<view class="nameIndex felx flex-vc">
					<text :id="searchWord[index]" v-show="showIndex(index)" class="ft-20 ">{{searchWord[index]}}</text>
				</view>
				<view class="friends-row bg-fff flex flex-vc" v-for="(friend,key) in flist" :key="key" @tap="toFriendsInfo(friend.account)">
					<view class="friends-head">
						<image :src="friend.avatarUrl"></image>
					</view>
					<view class="friends-username">
						<span>{{friend.name}}</span>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	// 状态管理
	import {mapState,mapMutations} from 'vuex';
	// 缓存管理
	import service from '@/service.js';
	// 数据请求
	import request from '@/request/request.js';
	export default {
		computed: {
			...mapState(['myFriends', 'serverUrl', 'userInfo','conversationMessageList']),

			indexTopDistance() {
				//this.friendsLists
				let distanceList = []
				distanceList.push(120) //A距离顶部距离120px
				//从B开始计算顶部距离
				for (let i = 0; i < this.friendsLists.length; i++) {
					let distance = distanceList[i] + this.friendsLists[i].length * 60;
					distanceList.push(distance);
				}
				return distanceList;
			}
		},
		data() {
			return {
				height: '',
				/*friendsLists的数据格式:[
					[],[],.....[] //一共27个数组，分别存不同字母开头的名字
				]*/
				friendsLists: [],
				distanceList: [], //每个索引单位离顶部距离
				searchWord: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
							'N', 'O', 'P', 'Q', 'R', 'S', 'T','U', 'V', 'W', 'X', 'Y', 'Z', '#'],
				// 最近联系人
				closeFriend: [],
				// 用户uid
				account: '',
			}
		},
		watch: {
			friendsLists:{
				handler(newValue, oldValue) {
					// 如果发生改变则更新缓存
					console.log("***********************************");
					service.addFriends(newValue);
					console.log("好友信息缓存已更新");
				},
				deep:true
			}
		},
		onShow() {
			// 更新好友列表
			this.friendsLists = this.myFriends;
		},
		onLoad() {
			// 获取用户uid
			if (this.userInfo) {
				this.account = this.userInfo.account;
			}
		},
		onTabItemTap() {
			// 点击底部按钮
			uni.startPullDownRefresh();
		},
		// 前往添加好友界面
		onNavigationBarButtonTap(e) {
			// 跳转到添加好友页面
			uni.navigateTo({
				url: '../../addressSubpackage/addFriends',
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
			...mapMutations(['deleteAllFriend', 'addFriendFromCache']),
			//前往好友资料页面
			toFriendsInfo(uid) {
				console.log(uid);
				uni.navigateTo({
					url: `../../addressSubpackage/friendsInfo/friendsInfo?uid=${uid}&isF=true`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 首字母查找
			nameSearch(index) {
				//判断该字母段是否有好友，有好友才点击滚动
				if (this.friendsLists[index].length != 0) {
					uni.pageScrollTo({
						scrollTop: this.distanceList[index],
						duration: 100
					});
				}
			},
			//是否显示字母索引
			showIndex(index) {
				let firstWord = this.friendsLists[index].slice(0, 1);
				return firstWord != '' && firstWord != null && firstWord != undefined;
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 从服务器拉取新数据
			request.getLatestFriend((data) => {
				// 清空好友列表
				this.deleteAllFriend();
				const searchWord = this.searchWord;
				for (let i in searchWord) {
					let temp = (data[searchWord[i]]);
					if (!temp) {
						temp = JSON.parse('[]');
					}
					this.friendsLists[i] = temp;
				}
				// 全部添加暂存
				this.addFriendFromCache(this.friendsLists);
				// 获取最近联系人
				this.closeFriend=this.conversationMessageList;
				//计算每个索引单位离顶部距离
				let distanceList = [];
				distanceList.push(120); //A距离顶部距离120px
				//从B开始计算顶部距离
				for (let i = 0; i < this.friendsLists.length; i++) {
					let distance = distanceList[i] + this.friendsLists[i].length * 60;
					distanceList.push(distance);
				}
				this.distanceList = distanceList;
			}, (err) => {
				console.log("数据请求失败");
				console.log(err);
			}, (complete) => {
				// 关闭下拉刷新动画
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 1000);
			});
		},

	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";

	page {
		background-color: @bgcolor;
	}

	a {
		text-decoration: none;
		color: black;
	}

	.top-contacts {
		height: 240upx;
		padding-left: 30upx;
		padding-top: 20upx;
		background-color: @colorF;
	}

	.top-contacts-text {
		font-size: 20upx;
		color: @codeBorder;
		height: 50upx;
	}

	.top-contacts-head image {
		float: left;
		height: 150upx;
		width: 150upx;
		margin-right: 25upx;
	}

	.nameIndex {
		padding-left: 30upx;
	}

	.friends-lists {
		width: 750upx;
	}

	.friends-lists-text {
		font-size: 20upx;
		color: @codeBorder;
	}

	.friends-row {
		padding-left: 30upx;
		display: flex;
		width: 750upx;
		height: 120upx;
		border-bottom: 1px solid @bgcolor;
	}

	.friends-head {
		width: 90upx;
		height: 90upx;
	}

	.friends-head image {
		width: 90upx;
		height: 90upx;
		border: 1px solid @codeBorder;
		border-radius: 50%;
	}

	.friends-username {
		display: inline-block;
		height: 100upx;
		line-height: 100upx;
		font-size: 25upx;
		font-weight: bold;
		padding-left: 20upx;
	}

	.username-search {
		position: fixed;
		z-index: 1;
		// height: 100%;
		right: 0;
		bottom: 50upx;
	}

	.word-search {
		width: 50upx;
		height: 36upx;
		line-height: 32upx;
		font-size: 24upx;
		text-align: center;
	}
</style>
