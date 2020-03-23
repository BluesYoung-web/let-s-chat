<template>
	<view>
		<view class="contentRow flex flex-js"  v-for="(item,index) in commentsList" :key="index"     >
			<view class="userHead flex flex-je" @tap="click(item)">
				<image :src="item.avatar" class="userHead-image"></image>
			</view>
			<view class="commentContent">
				<view class="userName flex flex-js" v-if="item.toNick">
					<text v-text="item.nick" class="userName-text"></text>
					<text class="pd-lt10 pd-rt10 userName-text" :style="{'color':'#3879D9'}">回复:</text>
					<text v-text="item.toNick" class="userName-text"></text>
				</view>	
				<view class="userName flex flex-js" v-else>
					<text v-text="item.nick" class="userName-text"></text>
				</view>	
				<view class="comment-before"></view>
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

<style>
	.pd-lt10{
		padding-left: 10upx;
	} 
	.pd-rt10{
		padding-right: 10upx;
	}
	.flex {
		display: box; /* OLD - Android 4.4- */
		display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
		display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
		display: -ms-flexbox; /* TWEENER - IE 10 */
		display: -webkit-flex; /* NEW - Chrome */
		display: flex;
	}
	.flex-js{
		justify-content: flex-start;
	}
	.flex-je { 
		justify-content: flex-end;
	}
	.contentRow{
		width: 100%;
		margin-top: 35upx;
	}
	.userHead{
		width: 100upx;
		height: 100upx;
	}
	.userHead-image{
		height: 65upx;
		width: 65upx;
		border: 1upx solid #344955;
		border-radius: 50%;
	}
	.commentContent{
		padding: 0 10upx;
	} 
	.userName{
		height: 50upx;
		line-height: 50upx;
	}
	.userName-text{
		font-size: 25upx;
		color: #344955;
	}
	.comment{
		width: 600upx;
		padding: 20upx;
		background-color: #edf0f2;
		font-size: 25upx;
		border-radius: 12upx;
	}
	.comment-before{
		border: 5upx solid #edf0f2;
		border: 8px solid transparent;
		border-bottom: 8px solid #edf0f2;
		top: 2px;
		width: 0;
		height: 0;
		position: relative;
		content: ' '
	}
</style>
