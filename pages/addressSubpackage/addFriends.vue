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
	
	<view class="inputActive flex flex-js" @tap="toFriendsInfo">
		<!-- {{inputMsg}} -->
		<view class="img flex flex-jc flex-vc">
			<image src="/static/img/friendSearch.png" mode=""></image>
		</view>
		<view class="inputMessage flex flex-vc">
			<text >找人：{{inputMsg}}</text>
		</view>
	</view>
	<!-- 用户不存在提示框 -->
	<uni-popup :show="isShow" type="center"  @change="change">
		<view class="popup flex flex-direction-column flex-vc">
			<text>该用户不存在</text>
			<button type="default" style="color: white;width: 50%;" @click="closePopup">确定</button>
		</view>
	</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import {mapState,mapMutations} from 'vuex';
	// 请求抽离
	import request from '@/request/request.js';
	export default{
		components: {uniPopup},
		data(){
			return{
				//找人显示内容
				inputMsg:'',
				isShow:false,
				account:'',
				phone:''
			}
		},
		computed:{
			...mapState(['serverUrl','userInfo'])
		},
		onLoad(){
			if (this.userInfo) {
				this.account=this.userInfo.account;
				this.phone=this.userInfo.phone;
			}
		},
		methods:{
			...mapMutations(['setInfoTemp']),
			// 关闭提示框
			closePopup(){
				this.isShow = false;
				this.inputMsg='';
			},
			// 点击空白处关闭提示框
			change(e){
				if (!e.show){
					this.isShow = false;
					this.inputMsg='';
				}
			},
			// 清空输入框
			cleanInput(){		
				// plus.key.hideSoftKeybord();
				// uni.hideKeyboard();
				this.inputMsg = ''
				
			},
			//点击取消，返回通讯录页面
			toAddress(){
				uni.switchTab({
					url: '../tabBar/address/address',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});				
			},
			// 跳转至查找的用户资料页面
			toFriendsInfo(){
				if(this.inputMsg){
					let str='';
					str= this.inputMsg.length==8 ? 'uid' : 'tel';
					// 如果是搜索自己，直接跳转我的页面
					if (this.inputMsg==this.account || this.inputMsg==this.phone) {
						uni.reLaunch({
						    url: '/pages/tabBar/my/my'
						});
						return ;
					}
					// 向服务器请求数据，查找用户
					request.searchUser(str,this.inputMsg,(data)=>{
						if(data){
							// 将搜索到的数据存入state
							this.setInfoTemp(data);
							// 拿到数据之后
							uni.navigateTo({
								url: `friendsInfo/friendsInfo?isF=${data.isF}`,
								success: res => {},
								fail: () => {},
								complete: () => {}
							});
						}else{
							this.isShow=true;
						}
					});
				}else if(inputMsg!=''){
					this.isShow=true;
				}
			}
		}

	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	@colorButton:@codeBorder;
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
