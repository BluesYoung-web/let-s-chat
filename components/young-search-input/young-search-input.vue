<!-- 输入框组件 可以设置背景色、宽度、圆角、边框、占位符 -->
<template>
	<view>
		<view class="search relative" :style="{width: width}">
			<span class="iconfont absolute searchIcon">&#xe6a3;</span>
			<input v-model="inputMsg" type="text" @input="$emit('getInputMsg', $event.target.value)" class="input" value="" :placeholder="placeholder" :style="{'border-radius': bdRadius, border:border, 'background-color':backgroundColor}" />
			<span @tap="clear" v-show="inputMsg.length != 0" class="iconfont absolute clearIcon">&#xe609;</span>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'searchInput',
		props: {
			//输入框宽度
			width: {
				type: String,
				default: "600upx"
			},
			//圆角
			bdRadius:{
				type: String,
				default: "10upx"
			},
			//边框
			border:{
				type: String,
				default: "1px solid #D5D5D6"
			},
			//占位符
			placeholder: {
				type: String,
				default: "搜索"
				// required: true
			},
			backgroundColor:{
				type: String,
				default: "#ffffff"
			}
		},
		data() {
			return {
				inputMsg:'',
			}
		},
		methods: {
			clear(){
				this.inputMsg = '';
				this.$emit('getInputMsg', this.inputMsg);
			},
		}
	}
</script>

<style lang="less">
    /* 引入公共样式 */
    @import '~@/common/common.less';
	/* 引入字体图标 */
	@font-face {
	  font-family: 'iconfont';
	  src: url('/static/ttf/input/iconfont.eot');
	  src: url('/static/ttf/input/iconfont.eot?#iefix') format('embedded-opentype'),
	      url('/static/ttf/input/iconfont.woff2') format('woff2'),
	      url('/static/ttf/input/iconfont.woff') format('woff'),
	      url('/static/ttf/input/iconfont.ttf') format('truetype'),
	      url('/static/ttf/input/iconfont.svg#iconfont') format('svg');
	}
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	.input {
		padding-left: 64upx;
		width: 100%;
		height: 80upx;
	}
	.searchIcon {
		top: 24upx;
		left: 24upx;
		width: 30upx;
		height: 30upx;
	}
	.clearIcon {
		top: 24upx;
		right: 20upx;
		width: 36upx;
		height: 36upx;
	}
</style>
