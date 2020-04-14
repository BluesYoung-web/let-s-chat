<!-- 修改昵称页 -->
<template>
	<view>
		<view class="">
			<input class="width-750 height-100 bg-fff pd-lt30" v-model="nick" maxlength="30"/>
		</view>
	</view>
</template>

<script>
	import data from '@/data.js';
	export default {
		data() {
			return {
				user: {},
				nick: ''
			}
		},
		onShow() {
			// 从缓存中获取用户数据
			data.user.get_info({
				success: (res) => {
					this.nick = res.nick;
					this.user = res;
					console.log(this.nick);
				}
			});
		},
		// 监听下一步按钮的点击事件
		onNavigationBarButtonTap(e){
			this.user.nick = this.nick;
			this.submitName();
		},
		methods: {
			// 提交成功的提示
			submitName(){
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
			}
		},
		computed:{
			canSubmit:function(){
				return this.user.name.length > 0 ? false : true;
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
</style>
