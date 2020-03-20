<!-- 我的页面 -->
<template>
	<view class="content">
		<!-- 个人信息页组件 -->
		<person-info :user="user" buttonText="编辑资料" :commendNum="myCommend"
		:focusNum="myFocus" :releaseNum="myRelease" @toMyCommend="toMyCommend"
		@clickButton="toMyInformation" @toMyFocus="toMyFocus" 
		@checkImg="checkImg" @toMyRelease="toMyRelease"></person-info>
	</view>
</template>

<script>
	import data from '@/data.js';
	import personInfo from "@/components/young-person-info/young-person-info.vue";
	export default {
		/**
		 * 组件
		 */
		components: {
			personInfo
		},
		onLoad() {
			/**
			 * 获取当前用户信息
			 */
			data.user.get_info({
				success: (res) => {
					this.user = res;
				}
			});
		},
		onShow(){
			//动态获取用户的发表的，关注该用户的，该用户关注的
			data.friend.get_follows({
				uid: this.user.uid,
				success: (data) => {
					this.myCommend = data.length;
				},
				fail: (code, err) => {
					console.log(code, err);
				}
			});
			data.friend.get_focus_list({
				uid: this.user.uid,
				success: (data) => {
					this.myFocus = data.length;
				},
				fail: (code, err) => {
					console.log(code, err);
				}
			});
			data.friend.get_release({
				uid: this.user.uid,
				success: (data) => {
					this.myRelease = data.length;
				},
				fail: (code, err) => {
					console.log(code, err);
				}
			});
		},
		data() {
			return{
				/**
				 * 当前用户信息
				 */
				user:{},
				/**
				 * 我赞过的(评论过的)
				 */
				myCommend:0,
				/**
				 * 关注我的
				 */
				myFocus:0,
				/**
				 * 我发表的
				 */
				myRelease:0,
			}
		},
		/**
		 * 点击导航栏设置按钮
		 */
		onNavigationBarButtonTap(e){
			// 跳转到设置页面
			uni.navigateTo({
				url: `/pages/mySubpackage/setting/setting`,
			});
		},
		methods: {
			/**
			 * 查看头像
			 */
			checkImg(){
				uni.previewImage({
					urls: [this.user.avatar]
				});
			},
			/**
			 * 跳转到编辑资料页面
			 */
			toMyInformation(){
				uni.navigateTo({
					url: `/pages/mySubpackage/myInformation/myInformation`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			/**
			 * 跳转到我赞过的页面
			 */
			toMyCommend(){
				uni.navigateTo({
					url: '/pages/mySubpackage/myCommend',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			/**
			 * 跳转到关注我的页面
			 */
			toMyFocus(){
				uni.navigateTo({
					url: '/pages/mySubpackage/myFocus',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			/**
			 * 跳转到我发表的页面
			 */
			toMyRelease(){
				uni.navigateTo({
					url: '/pages/mySubpackage/myRelease',
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