 <!--修改签名页 --> 
<template>
	<view class="">
		<!-- 输入文本框 -->
		<view class="relative">
			<textarea class="width-750 ft-36" v-model="motto" maxlength="20"/>
			<view class="absolute countLimit">
				<text>{{motto.length}}/</text>
				<text>20</text>
			</view>
		</view>
	</view>
</template>

<script>
	import data from '@/data.js';
	export default {
		data() {
			return {
				user: {},
				motto: ''
			}
		},
		onShow() {
			data.user.get_info({
				success: (res) => {
					this.user = res;
					this.motto = res.motto;
				}
			});
		},
		// 监听下一步按钮的点击事件
		onNavigationBarButtonTap(e){
			this.user.motto = this.motto;
			this.submitMotto();
		},
		methods: {
			submitMotto(){
				data.user.set_info({
					data: this.user,
					success: (res) => {
						console.log(res);
						uni.showToast({
							icon:"none",
							title:"修改成功！",
						});
					},
					fail: (code, err) => {
						console.log(code, err);
						uni.showToast({
							icon:"none",
							title:"修改失败！",
						});
					}
				});
				// 跳转回编辑资料的页面
				uni.navigateBack();
			}
		},
		computed:{
			canSubmit:function(){
				return this.motto.length > 0 ? false : true;
			}
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	page{
		background-color: @bgcolor;
	}
	textarea{
		background-color: @colorF;
		height: 350upx;
		padding-top: 20upx;
		padding-left: 20upx;
	}
	
	/* 字数限制的样式 */
	.countLimit{
		bottom: 20upx;
		right: 30upx;
	}
</style>
