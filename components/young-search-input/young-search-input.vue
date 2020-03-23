<!-- 输入框组件 可以设置背景色、宽度、圆角、边框、占位符 -->
<template>
	<view>
		<view class="search relative" :style="{width: width}">
			<img src="/static/img/search.png" class="absolute searchIcon"/>
			<input v-model="inputMsg" type="text" @input="$emit('getInputMsg', $event.target.value)" class="input" value="" :placeholder="placeholder" :style="{'border-radius': bdRadius, border:border, 'background-color':backgroundColor}" />
			<img @tap="clear" v-show="inputMsg.length != 0" 
			src="/static/img/clear.png" class="absolute clearIcon"/>
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
				// console.log('1111111111111111111111')
				this.inputMsg = '';
				this.$emit('getInputMsg', this.inputMsg);
			},
		}
	}
</script>

<style lang="less">
    .absolute{
		position: absolute;
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
