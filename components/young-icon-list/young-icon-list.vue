<!-- 个人页列表组件 -->
<template>
	<view>
		<view @click="btnClick" class="bg-fff pd-lr20 width-750 height-100  flex flex-direction-row flex-vc flex-jsb">
			<view class="h100 line-h100 flex flex-vc">
				<uni-icons v-if="iconType" :type="iconType" :size="size" :color='color'></uni-icons>
				<image v-if="!iconType" class="width-50 height-50" :src="iconUrl" mode=""></image>
				<text class="pd-lt10 ft-30 color-333">{{title}}</text>
			</view>
			<view class="flex flex-ac">
				<uni-icons v-if="iconType && showRed" type="more-filled" size="24" color="#ff0000"></uni-icons>
				<uni-icons type="arrowright" size='24' color='#344955'></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	export default {
		name: 'iconList',
		components:{
			uniIcons
		},
		props: {
			iconType: {
				type: String,
				default: ''
			},
			size:{
				type: [String,Number],
				default: 32
			},
			color:{
				type: [String],
				default: '#344955'
			},
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
			showRed: {
				type: [String, Boolean],
				default: false
			}
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
