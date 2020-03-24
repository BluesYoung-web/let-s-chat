<!-- 输入框组件 可以设置背景色、宽度、圆角、边框、占位符 -->
<template>
	<view :class="type == 'createChatRoom' ? 'ct' : ''" :style="{width: width}">
		<view class="search" v-if="type == 'createChatRoom'">
			<img src="/static/img/search.png" class="absolute searchIcon"/>
			<input v-model="inputMsg" type="text" 
			@input="$emit('getInputMsg', $event.target.value)" 
			class="input" value="" :placeholder="placeholder" 
			:style="{'border-radius': bdRadius, border:border, 'background-color':backgroundColor}" />
			<img @tap="clear" v-show="inputMsg.length != 0"
			src="/static/img/clear.png" class="absolute clearIcon"/>
		</view>
		<view class="relative" v-else>
			<img src="/static/img/search.png" class="absolute searchIcon"/>
			<input v-model="inputMsg" type="text" 
			@input="$emit('getInputMsg', $event.target.value)" 
			class="input" value="" :placeholder="placeholder" 
			:style="{'border-radius': bdRadius, border:border, 'background-color':backgroundColor}" />
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
			},
			type:{
				type: String,
				default: ''
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

<style>
	.ct{
		position: relative;
	}
	.search{
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0upx;
		top: 20upx;
		z-index: -1;
	}
    .absolute{
		position: absolute;
	}
	.input {
		padding-left: 64upx;
		padding-right: 64upx;
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
