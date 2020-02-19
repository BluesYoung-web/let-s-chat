<template>
	<view>
		<view class="content">
			<view class=" flex flex-direction-column flex-vc pd-tp150">
				<view class="width-200 height-200">
					<image class="width-200 height-200" src="/static/img/success.png" mode="scaleToFill"></image>
				</view>
				<text class="font-weight-550 color-344955 mg-tp50">绑定成功</text>
				<view class="flex flex-direction-column flex-vc ft-28 color-344955 mg-tp50 font-weight-550">
					<text>恭喜你成功绑定了手机号：{{newPhone}}</text>
					<text>以后可使用该手机号进行登录</text>
				</view>
				<button type="" class="finishBtn font-weight-550 mg-tp250" plain="true" @click="isFinished">完成</button>
			</view>
			
		</view>
	</view>
</template>

<script>
	// 存储用户信息
	import {mapState,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				newPhone:'',//更换过的手机号
			}
		},
		onLoad(e) {
			if(e.phone){
				this.newPhone=e.phone;
			}
		},
		methods: {
			isFinished(){
				// 跳转到我的页面
				uni.reLaunch({
					url: '../../../tabBar/my/my',
					success: res => {
					},
					fail: () => {},
					complete: () => {}
				});
			},
		},
		computed:{
			...mapState(['userInfo'])
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.finishBtn{
		border: 2px solid @codeBorder;
		border-radius: 8upx;
		width: 320upx;
		color: @codeBorder;
	}
</style>
