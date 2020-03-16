<template>
	<view>
		<view class="contentRow flex flex-js"  v-for="(item,index) in commentsList" :key="index"     >
			<view class="userHead flex flex-je" @tap="click(item)">
				<image :src="item.avatar" mode=""></image>
			</view>
			<view class="commentContent">
				<view class="userName flex flex-js">
					<text v-text="item.nick"></text>
					<text v-if="item.toNick">
						<text class="pd-lt10 pd-rt10" :style="{'color':'#3879D9'}">回复:</text>
						<text v-text="item.toNick"></text>
					</text>
				</view>	
				<view class="comment" @tap="feedBack(item)">
					<text>{{item.content}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'commentsList',
		props: {
			commentsList: {
				type: Array,
				default(){
					return []
				}
			}
		},
		methods:{
			click(item){
				this.$emit('clickUser', item);
			},
			feedBack(item){
				this.$emit('feedBack', item);
			}
		}
	}
</script>

<style lang="less">
	@import '~@/common/common.less';
	.contentRow{
		width: 100%;
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
	.comment{
		width: 600upx;
		padding: 20upx;
		background-color: @bgcolor;
		font-size: 25upx;
		border-radius: 12upx;
	}
	.comment::before{
		border: 5upx solid @bgcolor;
		border: 8px solid transparent;
		border-bottom: 8px solid @bgcolor;
		left: -8px;
		top: -27px;
		width: 0;
		height: 0;
		position: relative;
		content: ' '
	}
	
</style>
