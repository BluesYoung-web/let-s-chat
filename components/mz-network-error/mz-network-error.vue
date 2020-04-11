<template name="mz-network-error">
	<view v-if="show" class="mz-network-error-wrapper" :class="{fixed: fixed}" :style="{top: top}" @tap="handleClick">
		<text class="left mz-iconfont icon-wangluocuowu" v-if="icon.indexOf('/') === -1"></text>
		<image class="left" :src="icon" mode="widthFix" v-else></image>
		<view class="right">
			<text>{{message}}</text>
			<text v-if="showRightBtn" class="mz-iconfont icon-goto"></text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'mz-network-error',
		data() {
			return {
				show: false
			}
		},
		props: {
			top: {
				type: String,
				default: '0'
			},
			message: {
				type: String,
				default: '网络异常，请检查您的网络设置'
			},
			showRightBtn: {
				type: Boolean,
				default: true
			},
			fixed: {
				type: Boolean,
				default: false
			},
			icon: {
				type: String,
				default: 'mz-iconfont icon-wangluocuowu'
			}
		},
		created() {
			this.isNetworkCanUse(usable => {
				this.show = !usable;
			});
			
			uni.onNetworkStatusChange(res => {
				this.show = !res.isConnected;
			});
		},
		methods: {
			isNetworkCanUse(callback) {
				uni.getNetworkType({
				    success: res => {
						if (res.networkType === '2g' || res.networkType === 'none') {
							callback(false);
						} else {
							callback(true);
						}
				    },
					fail() {
						callback(false);
					}
				});
			},
			handleClick() {
				this.$emit('clickFn');
			}
		}
	}
</script>

<style>
	@font-face {
		font-family: "mz-iconfont";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAO0AAsAAAAAB8AAAANlAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgqDIIJlATYCJAMMCwgABCAFhG0HPRuyBsieA+7mcr4+nKi5TBNekm1HUC1bz4a7e3JSIUp8Lo+iUEiy0AgLGonQeIynfDbiDtbV7BkvVFiNOKeHGCFWoUFM1tZ0YW1hIxRLVrGWagH/902/O3QsJUE4sFCod58UqeAlHTDuj3unf3UeZvMB5TTHookBxp13AY21KaG0hLFh7CaChnicwJA1GpAzp9sdugowLhCPEiWgm9EqDYWhE5qKpQXiBbC6VIxaxDP/ffzbCCCpGcDU87c3YfU1rg3QWf9ZEEQR4E1nhrGKjH2gEFeV1kuNKLoPbciTNpszG0VIUwX+e8C5vriBf3gkQTQA8kfAthJLfGlgbiIzkPlXzXu40Q1aPAFvtm4GuCU0C0w2k0hRCC/P4iIVpdKivmw1YWUJB8luKajI4qSWt0tdn+qUl/TWSjc9CypqvFB3TiephLN9qlAuVdKbXdH7wm/Hu1th3mFzk1Pe3kZUlS4tncgaL5nMnuIVd/Ha2vLe2fHd3vauqO5ul7KyKO9s3s7aqrKur4traV3V0VPDsSCrjimPAU4ZbWkRW4mJdDTzCWN5+WMqY2C9nLrp7ijO91nEiII+pfbOElOj3aNQG11pYNapSBn+6HVtnFlcpYQrlrRWzjkpeqKcNWoerHQcsD4OzbqZCLUyk0gf9VesMas2rzarCWxyR3i8mhvizpNXJvBmT/bOa7d/vHu8HXf3x6fGW6Hcf7VeU/dfCAPoX1G/WfgP4jf5Lyf+q/OMvddfhNItXglkDMCniJdxdjdyLQZyQSfRmfdn2g30PSimAOhycaUay0N2rX3fakMwQA84pxwPV87efTx0ZhNIWquQddbRQtqHatgBNDqHMGSP8+ph02I0RCECu/IlCBOGIBnzAdmEJbSQjqCacwuNidAw5CL2lsM2k5DsY0ikZGJEMkp4HFrIkPZFoU4q80WcFnDqk+LECaCulk4+caSQ4ilmxCaoZVychcIYDtBJOo18nzEqhl2S6VQcl740bW1h1ZumvMgA+k7FiJAiJhShgiQkFrJo81S/8H0dUTI+IW6o67E+kVjC6Rzp0qLTAT1Kw051t/JKrJyyFCdlQUIxFkBOkpn4MMpQVPUgF5FSU+IB4ReNttJI2FU6XV4evN8WGAK2zIFC0AgGyk1kysPE8FD5GUvkKTIAAAAA') format('woff2');
	}
	
	.mz-iconfont {
	  font-family: "mz-iconfont" !important;
	  font-size: 30rpx;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	
	.icon-goto:before {
	  content: "\e634";
	}
	
	.icon-wangluocuowu:before {
	  content: "\e62c";
	}
	
	.mz-network-error-wrapper {
		position: relative;
		width: 750rpx;
		height: 88rpx;
		background: rgba(43,44,46,0.6);
		display: flex;
		align-items: center;
		position: relative;
		background: #ffecee;
	}
	
	.mz-network-error-wrapper.fixed {
		position: fixed;
		z-index: 9999;
		top: calc(44px + var(--status-bar-height));
		left: 0;
		right: 0;
		width: 100%;
		background: rgba(43,44,46,0.6);
	}

	.mz-network-error-wrapper .left {
		width: 40rpx;
		height: 40rpx;
		font-size: 38rpx;
		color: #f65856;
		margin-left: 30rpx;
		margin-right: 24rpx;
	}
	
	.mz-network-error-wrapper.fixed .left {
		color: #fff;
	}
	
	.mz-network-error-wrapper .right {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-right: 16px;
		line-height: 88rpx;
	}

	.mz-network-error-wrapper .right text {
		color: #888;
		font-size: 26rpx;
	}
	
	.mz-network-error-wrapper.fixed .right text {
		color: #fff;
	}
</style>
