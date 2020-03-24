<template>
	<!-- 好友圈评论输入 --> 
	<view class="body">
		<!-- 自定义导航栏 -->
		<uni-nav-bar left-icon='back' left-text="返回" background-color="#344955" color="#fff"
		@clickLeft="back" @clickRight="putUp">
			<view class="" slot="right">
				<button type="default" class="button" :class="canPutUp ? 'sure' : 'btn'">发表</button>
			</view>
		</uni-nav-bar>
		<!-- 输入文本框 -->
		<view class="writeComment">
			<textarea class="width-full textarea" value="" v-model="content" placeholder="写评论" maxlength="100" />
			<text class="tips">{{content.length}}/100</text>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import data from '@/data.js';
	export default {
		components: {
			uniNavBar
		},
		onLoad(e) {
			this.findId = e.findId;
			this.toUserId = e.toUserId ? e.toUserId : null;
		},
		data() {
			return {
				/**
				 * 好友圈id
				 */
				findId: null,
				/**
				 * 回复用户id
				 */
				toUserId: null,
				/**
				 * 输入框的内容
				 */
				content: '',
			}
		},
		methods: {
			//返回评论列表界面
			back(){
				// 直接返回上个页面
				uni.navigateBack();
			},
			// 发表评论
			putUp(){
				data.find.put_comments({
					data: {
						findId: this.findId,
						toNick: this.toUserId,
						content: this.content
					},
					success: () => {
						uni.showToast({
							title: '评论发表成功！'
						});
						this.back();
					},
					fail: (code, err) => {
						console.log(code, err);
					}
				});
			},
		},
		computed:{
			canPutUp(){
				return this.content.length > 0 ? true : false ;
			}
		}
	}
</script>

<style>
	.width-full{
		width: 100%;
	}
	.body{
		background-color: #edf0f2;
		height: 100%;
	}
	/* 右侧按键 */
	.button{
		position: relative;
		font-size: 36upx;
		width: 120upx;
		height: 70upx;
		line-height: 70upx;
		margin-right: 60upx;
	}
	.btn{
		background-color: #C8C7CC !important;
		color: #aaa !important;
	}
	.sure{
		background-color: #F9AA33 !important;
		color: #FFFFFF !important;
	}
	.writeComment{
		margin-top: 50upx;
		position: relative;
	}
	.textarea{
		height: 200upx;	
		font-size: 30upx;	
		padding: 10upx;
	}
	.tips{
		position: absolute;
		right: 10upx;
		bottom: 0upx;
	}
</style>

