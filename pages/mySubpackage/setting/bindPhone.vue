<template>
	<view>
		<view class="">
			<text class="pre-86">+86</text>
			<input class="width-750 height-100 bg-fff pd-lt100" 
			v-model="user.tel" type="number" maxlength="11"
			placeholder-class="color-ccc" placeholder="请填写手机号"/>
		</view>
	</view>
</template>

<script>
	import data from '@/data.js';
	import tools from '@/core/tools.js';
	export default {
		data() {
			return {
				user:{}
			}
		},
		onLoad(e) {
			this.user.wxid = e.wxid;
			console.log(e.wxid);
		},
		// 监听下一步按钮的点击事件
		onNavigationBarButtonTap(e){
			this.phoneChange();
		},
		methods: {
			// 确认绑定手机号
			phoneChange(){
				if(tools.phoneCheck(this.user.tel)){
					data.user.bind_tel({
						data: this.user,
						success: (res) => {
							console.log(res);
							uni.showToast({
								icon: 'none',
								title: '手机号绑定成功！',
							});
							uni.navigateTo({
								url:`bindSuccessful?phone=${this.user.tel}`
							});
						}
					});
				}else{
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
