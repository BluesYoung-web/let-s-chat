<template>
	<view>
		<view class="">
			<text class="pre-86">+86</text>
			<input class="width-750 height-100 bg-fff pd-lt100" 
			v-model="newPhone" type="number" maxlength="11"
			placeholder-class="color-ccc" placeholder="请填写新手机号"/>
		</view>
	</view>
</template>

<script>
	import data from '@/data.js';
	import tools from '@/core/tools.js';
	export default {
		data() {
			return {
				newPhone:'',
				user:{}
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
			this.phoneChange();
		},
		methods: {
			// 确认修改手机号
			phoneChange(){
				if (tools.phoneCheck(this.newPhone)) {
					uni.showLoading({
						title: '加载中',
						mask:true,
					});
					setTimeout(() => {
						uni.hideLoading();
					}, 1000);
					this.user.tel = this.newPhone;
					data.user.set_info({
						data: this.user,
						extra: 'changePhone',
						success: (res) => {
							console.log(res);
							uni.showToast({
								icon: 'none',
								title: '手机号更改成功！',
							});
							uni.navigateTo({
								url:`bindSuccessful?phone=${this.newPhone}`
							});
						},
						fail: (code, err) => {
							console.log(code, err);
							uni.showToast({
								icon: 'none',
								title: '手机号绑定失败,该手机号已经被绑定！',
							});
						}
					});
				} else{
					uni.showToast({
						icon: 'none',
						title: '请输入有效手机号！',
					});
				}
				
			}
		},
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	page{
		background-color: @bgcolor;
	}
</style>
