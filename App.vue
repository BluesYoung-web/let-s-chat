<script>
	import data from '@/data.js';
	export default{
		data(){
			return{}
		},
		onLaunch() {
			/**
			 * 注册好友圈更新监听
			 */
			uni.$on('newFinds', () => {
				// 显示好友圈的小红点
				uni.showTabBarRedDot({
					index: 2
				});
			});
			/**
			 * 注册好友申请
			 */
			uni.$on('newFriend', () => {
				// 显示通讯录的小红点
				uni.showTabBarRedDot({
					index: 1
				});
			});
			data.user.login({
				success: () => {
					uni.reLaunch({
						url:"/pages/tabBar/message"
					});
				},
				fail: () => {
					uni.showToast({
						icon: "none",
						title: "缓存中找不到用户信息"
					});
					uni.reLaunch({
						url: "/pages/common/login"
					});
				}
			});
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	@import '~@/common/common.less';
	uni-checkbox .uni-checkbox-input {
		position: relative;
		margin-left: 20upx;
		border-radius: 50%; 
		border: 1rpx solid #C0C0C0; 
	} 
	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked { 
		background-color: #3CC51F; 
		color: #FFFFFF !important;
		border: 1rpx solid #3CC51F; 
	} 
	uni-checkbox .uni-checkbox-wrapper { 
		width: 100%; 
	}
	uni-view,a,uni-text,uni-button{
		z-index: 1;
	}
	uni-view[data-v-187d6796], a[data-v-187d6796], uni-text[data-v-187d6796], uni-input[data-v-187d6796], uni-button[data-v-187d6796]{
		z-index: 0;
	}
	.uni-navbar--border[data-v-3f69ffa0]{
		z-index: 2;
	}
</style>
