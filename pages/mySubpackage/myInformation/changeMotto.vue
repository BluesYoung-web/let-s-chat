 <!--修改签名页 --> 
<template>
	<view class="">
		<!-- 输入文本框 -->
		<view class="relative">
			<textarea class="width-750 ft-36" v-model="user.motto" maxlength="20"/>
			<view class="absolute countLimit">
				<text>{{user.motto.length}}/</text>
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
				user: {}
			}
		},
		onShow() {
			data.user.get_info({
				success: (res) => {
					this.user = res;
				}
			});
		},
		// 监听下一步按钮的点击事件
		onNavigationBarButtonTap(e){
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
							title:"修改成功！"
						});
					},
					fail: (code, err) => {
						console.log(code, err);
						uni.showToast({
							icon:"none",
							title:"修改失败！"
						});
					}
				});
				// 跳转回编辑资料的页面
				uni.navigateBack();
				setTimeout(() => {
					uni.hideToast();
				}, 1000);
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
		height: 3.5*@u100;
		padding-top: 0.2*@u100;
		padding-left: 0.2*@u100;
	}
	
	/* 字数限制的样式 */
	.countLimit{
		bottom: 0.2*@u100;
		right: 0.3*@u100;
	}
</style>
