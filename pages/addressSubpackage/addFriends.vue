<template>
	<!-- 添加好友 -->
	<view>	
		<!-- 自定义导航栏 -->
		<view class="navBar flex-vc flex-js">
			<view class="search flex flex-jc flex-vc ">
				<image src="/static/img/searchFriend.png" mode=""></image>
				<input type="text" v-model="inputMsg" placeholder="手机号/来聊账号"/>
				<image src="/static/img/clear.png" @tap="cleanInput"></image>
			</view>					
			<text @tap="toAddress()">取消</text>
		</view>
		<!-- 同步显示搜索内容 -->
		<view v-if="ifShowSearch" class="inputActive flex flex-js" @tap="searchUser">
			<view class="img flex flex-jc flex-vc">
				<image src="/static/img/friendSearch.png" mode=""></image>
			</view>
			<view class="inputMessage flex flex-vc">
				<text >找人：{{inputMsg}}</text>
			</view>
		</view>
		<!-- 用户不存在提示框 -->
		<uni-popup :show="ifShowPoup" type="center"  @change="change">
			<view class="popup flex flex-direction-column flex-vc">
				<text>该用户不存在</text>
				<button type="default" style="color: white;width: 50%;" @click="closePopup">确定</button>
			</view>
		</uni-popup>
		<!-- 存在多个用户时以列表显示 -->
		<view class="bg-fff pd-tp100" v-if="friendsList.length > 0">
			<address-item :showStatus="false" :friendsList="friendsList" @toFriendInfo="toUserInfo"></address-item>
		</view>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import addressItem from "@/components/young-address-item/young-address-item.vue";
	import data from "@/data.js";
	export default{
		components: {
			uniPopup,
			addressItem
		},
		data(){
			return{
				/**
				 * 具体搜索内容
				 */
				inputMsg: '',
				/**
				 * 是否显示提示层
				 */
				ifShowPoup: false,
				/**
				 * 是否显示找人按钮
				 */
				ifShowSearch: true,
				/**
				 * 用户列表(当搜索到的用户大于1个时显示)
				 */
				friendsList: [],
				/**
				 * 当前用户
				 */
				user: {}
			}
		},
		watch: {
			inputMsg(newValue, oldValue) {
				if(newValue.length == 0){
					this.friendsList.length = 0;
					this.ifShowSearch = true;
				}
			}
		},
		onShow() {
			data.user.get_info({
				success: (res) => {
					this.user = res;
				}
			});
		},
		methods:{
			// 关闭提示框
			closePopup(){
				this.ifShowPoup = false;
				this.inputMsg='';
			},
			// 点击空白处关闭提示框
			change(e){
				if (!e.show){
					this.ifShowPoup = false;
					this.inputMsg='';
				}
			},
			// 清空输入框
			cleanInput(){		
				this.inputMsg = '';
			},
			//点击取消，返回通讯录页面
			toAddress(){
				uni.navigateBack();			
			},
			/**
			 * 搜索用户
			 */
			searchUser(){
				if(this.inputMsg){
					// 如果搜索的是自己
					if(this.inputMsg == this.user.uid){
						uni.reLaunch({
							url:"/pages/tabBar/my"
						});
						return;
					}
					// 向服务器请求数据，查找用户
					data.user.search({
						key: this.inputMsg,
						success: (res) => {
							// 如果为多个用户
							this.ifShowSearch = false;
							this.friendsList = res;
						},
						fail: (code, err) => {
							console.log(code, err);
						}
					});
				}else if(inputMsg!=''){
					this.ifShowPoup=true;
				}
			},
			/**
			 * 进入对应用户页面
			 */
			toUserInfo(item){
				console.log(item);
				if(item.uid == this.user.uid){
					uni.reLaunch({
						url:"/pages/tabBar/my"
					});
				}else{
					uni.navigateTo({
						url:`/pages/addressSubpackage/friendsInfo?uid=${item.uid}&isF=${item.isF}&isFocus=${item.isFocus}`
					});
				}
			}
		}

	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	@colorButton:@codeBorder;
	.popup{
		width: 500upx;
		height: 230upx;
		background-color: @colorF;
		border-radius: 5px;
		text-align: center;
	}
	.popup text{
		height: 100upx;
		line-height: 100upx;		
	}
	.popup button{
		height: 100upx;
		background: @codeBorder;
	}
	.search{
		height: 60upx;
		background-color: @colorF;
		margin-left: 50upx;
	}
	.search image{
		margin-left: 20upx;
		margin-right: 20upx;
		width: 30upx;
		height: 30upx;
	}
	.search input{
		height: 50upx;
		width: 450upx;
		font-size: 30upx;
		color: @colorButton;
		background: @colorF;
	}
	.navBar text{
		margin-left: 30upx;
		font-size: 35upx;
		background-color: @colorButton;
		color: @colorF;
	}
	.inputActive{
		margin-top: 100upx;
		background-color: @colorE;
	}
	.img{
		width: 100upx;
		height: 100upx;
	}
	.img image{
		width: 50upx;
		height: 50upx;
	}
</style>
