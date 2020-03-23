<!-- 图标列表组件 -->
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

<style>
	.color-333{
		color: #333;
	}
	.ft-30{
		font-size: 30upx;
	}
	.line-h100{
		line-height: 100upx;
	}
	/* flex布局属性集 */
	.flex {
		display: box; /* OLD - Android 4.4- */
		display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
		display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
		display: -ms-flexbox; /* TWEENER - IE 10 */
		display: -webkit-flex; /* NEW - Chrome */
		display: flex;

	}
	/* 按行排列 */
	.flex-direction-row{
		flex-direction: row;
	}
	/* 垂直居中 */
	.flex-vc {
		/* 09版 */
		-webkit-box-align: center;
		/* 12版 */
		-webkit-align-items: center;
		-moz-align-items: center;
		-ms-align-items: center;
		-o-align-items: center;
		align-items: center;
	}
	.flex-jsb { 
		justify-content: space-between;
	}
	.flex-ac { 
		align-items: center;
	}
	.height-100, .h100{
		height: 100upx;
	}
	.width-750{
		width: 750upx;
	}
	.width-50{
		width: 50upx;
	} 
	.height-50{
		height: 50upx;
	}
	.pd-lr20{
		padding: 0 20upx;
	}
	.pd-lt10{
		padding-left: 10upx;
	}
	.bg-fff{
		background-color: #fff;
	}
	.rightIcon{
		height: 30upx;
		width: 30upx;
		margin-left: 30upx;
	}
</style>
