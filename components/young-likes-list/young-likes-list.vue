<template>
	<view>
		<view class="contentRow flex flex-js"  v-for="(item,index) in likesList" :key="index">
			<view class="userHead flex flex-jc flex-vc" @tap="click(item)">
				<image :src="item.avatar" mode=""></image>
			</view>
			<view class="commentContent flex flex-vc" @tap="click(item)">
				<view class="userName flex flex-vc">
					<text>{{item.nick}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'likesList',
		props:{
			likesList: {
				type: Array,
				default(){
					return []
				}
			}
		},
		methods:{
			click(item){
				this.$emit('clickUser', item);
			}
		}
	}
</script>

<style lang="less">
	@import '~@/common/common.less';
	.contentRow{
		width: 100%;
		height: 100upx;
		margin-top: 35upx;
	}
	.userHead{
		width: 100upx;
		height: 100upx;
	}
	.userHead image{
		height: 65upx;
		width: 65upx;
		border: 1upx solid @codeBorder;
		border-radius: 50%;
	}
	.commentContent{
		padding: 0 10upx;
	} 
	.userName{
		height: 50upx;
	}
	.userName text{
		font-size: 25upx;
		color: @codeBorder;
	}
</style>
