<template>
	<view>
		<view class="flex flex-direction-row flex-vc flex-jsb width-750 height-120 pd-lr30" v-for="(item, index) in friendsList" :key="index">
			<image class="width-80 height-80 bd-rd50" :src="item.avatar" mode="aspectFill" @tap="toFriendInfo(item)"></image>
			<view class="width-600 flex flex-direction-row flex-jsb pd-lr20 h120 line-h120 bd-bt-gainsboro" @tap="toFriendInfo(item)">
				<text class="ft-32">{{item.nick}}</text>
				<text v-if="item.online" class="ft-28 color-f9aa33">在线</text>
				<text v-else class="ft-28 color-999">离线</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		/**
		 * 组件名称
		 */
		name: 'addressItem',
		/**
		 * 组件属性
		 */
		props: {
			friendsList: {
				type: Array,
				default(){
					return []
				}
			}
		},
		methods:{
			/**
			 * 点击进入好友详情页
			 */
			toFriendInfo(item){
				this.$emit('toFriendInfo', item);
			}
		}
	}
</script>

<style lang="less">
    /* 引入公共样式 */
    @import '~@/common/common.less';
</style>
