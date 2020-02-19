<!-- 个人页列表组件 -->
<template>
	<view>
		<view @click="btnClick" class="bg-fff pd-lr20 width-750 height-100  flex flex-direction-row flex-vc flex-jsb">
			<view class="h100 line-h100 flex flex-vc">
				<image class="width-50 height-50" :src="iconUrl" mode=""></image>
				<text class="pd-lt10 ft-30 color-333">{{title}}</text>
			</view>
			<view class="flex flex-ac">
				<image class="rightIcon" src="/static/img/arrow-right.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'iconList',
		props: {
			iconUrl: {
				type: String,
				default: '/static/img/message.png',
				// required: true
			},
			title: {
				type: String,
				default: '默认信息',
				// required:true
			},
		},
		methods: {
			btnClick() {
				this.$emit("click");
			},
			loadMore(e) {
				this.$emit("click");
			}
		}
	}
</script>

<style lang="less">
    /* 引入公共样式 */
    @import '~@/common/common.less';
	.rightIcon{
		height: 30upx;
		width: 30upx;
		margin-left: 30upx;
	}
</style>
