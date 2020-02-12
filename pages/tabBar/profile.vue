<!-- 我的页面 -->
<template>
	<view class="content">
		<!-- 首部头像下的背景颜色 -->
		<view class="topBg width-full bg-344955 absolute"></view>
		<!-- 设置按钮 -->
		<view class="settingIcon width-full height-50 flex flex-je pd-lr30 pd-tp20">
			<image class="width-50 height-50" src="/static/img/set.png" mode="scaleToFill"></image>
		</view>
		<!-- 头像 -->
		<view class="avatar mg-tp20" @tap="checkImg">
			<image :src="user.avatar" mode="aspectFill" v-if="user.avatar"></image>
			<!-- 默认头像 -->
			<image src="/static/img/defaultHead.jpg" mode="aspectFill" v-else></image>
		</view>
		
		<!-- 昵称资料 -->
		<view class="messageContent mg-tp60 flex flex-direction-column flex-vc">
			<!-- 昵称 -->
			<view class="name ft-36 font-weight-600 color-344955 one-line-ellipsis">
				<text v-if="user.nick">{{user.nick}}</text>
				<text v-else class="">用户昵称</text>
			</view>
			<!-- 来聊账号 -->
			<view class="account ft-26 color-889aa3 mg-tp15">
				<text>来聊账号：</text>
				<text v-if="user.uid">{{user.uid}}</text>
				<text v-else>未绑定手机号，请先去设置页绑定</text>
			</view>
			<!-- 签名 -->
			<view class="motto ft-26 color-889aa3 mg-tp20 one-line-ellipsis">
				<text v-if="user.motto">{{user.motto}}</text>
				<text v-else class="">暂未设置签名</text>
			</view>
			
			<!-- 编辑资料按钮 -->
			<button class="editInfoBtn bg-889aa3 color-889aa3 mg-tp60"  plain="true" @tap="toMyInformation">编辑资料</button>
			
			<!-- 下方的赞&关注&发表 -->
			<view class="flex flex-direction-row flex-hc width-750">
				<!-- 赞 -->
				<view class="myCommend" @tap="toMyCommend">
					<text class="color-889aa3 ft-26">赞</text>
					<text class="color-4A6572 ft-28 mg-tp15">{{myCommend}}</text>
				</view>
				<!-- 关注 -->
				<view class="myFocus" @tap="toMyFocus">
					<text class="color-889aa3 ft-26">关注</text>
					<text class="color-4A6572 ft-28 mg-tp15">{{myFocus}}</text>
				</view>
				<!-- 发表 -->
				<view class="myRelease" @tap="toMyRelease">
					<text class="color-889aa3 ft-26">发表</text>
					<text class="color-4A6572 ft-28 mg-tp15">{{myRelease}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import data from '@/data.js';
	export default {
		onLoad() {
			data.user.get_info({
				success: (res) => {
					this.user = res;
				}
			});
		},
		data() {
			return{
				user:{
					name:"", //昵称 
					motto:"",//签名 
					account:'',//账号 
					phone:'', //手机号
					avatarUrl:"",//头像地址 /static/img/avatar.png
					wxId:'' //微信id
				},
				myCommend:0,//赞数
				myFocus:0,//关注
				myRelease:0,//发表
			}
		},
		
		// 
		onShow() {
		},
		// 监听设置按钮的点击事件
		onNavigationBarButtonTap(e){
			// 跳转到设置页面
			uni.navigateTo({
				url: `../../mySubpackage/setting/setting`,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
			checkImg(){
				uni.previewImage({
					urls: [this.user.avatarUrl]
				});
			},
			// 跳转到编辑资料页面
			toMyInformation(){
				// 先判断是否绑定了手机号
				if (this.user.account) {
					uni.navigateTo({
						url: `../../mySubpackage/myInformation/myInformation`,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				} else{
					uni.showToast({
						title:"请先去设置页绑定手机号",
						icon:"none"
					})
				}
				
			},
			
			
			//---------下方的赞&关注&发表--------
			// 跳转到我收到的赞的页面
			toMyCommend(){
				uni.navigateTo({
					url: '../../mySubpackage/myCommend/myCommend',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 跳转到关注我的页面
			toMyFocus(){
				uni.navigateTo({
					url: '../../mySubpackage/myFocus/myFocus',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 跳转到我收到的赞的页面
			toMyRelease(){
				uni.navigateTo({
					url: '../../mySubpackage/myRelease/myRelease',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
</style>