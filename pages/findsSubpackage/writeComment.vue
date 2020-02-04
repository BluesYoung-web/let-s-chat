<template>
	<!-- 好友圈评论输入 --> 
	<view class="">
	<view class="navBar">
		<view class="navBarCancel flex flex-js flex-vc" @tap="back">
			<image src="/static/img/cancel.png" mode=""></image>
			<text>Cancel</text>
		</view>
		<view class="navBarTitle flex flex-jc flex-vc">
			<text>发评论</text>
		</view>
		<view class="navBarBtn flex flex-je flex-ac bg-344955" >
			<button :disabled="canPutUp" @tap="putUp" class="my-color-fff">发表</button>
		</view>
	</view>
		<!-- 输入文本框 -->
		<view class="writeComment">
			<textarea class="width-full" value="" v-model="content" placeholder="写评论" maxlength="100" />
			<view class="absolute countLimit ">
				<text>{{content.length}}/</text>
				<text>100</text>
			</view>
		</view>
</view>
</template>

<script>
	// 请求抽离
	import request from '@/request/request.js';
	export default {
		onLoad(e) {
			this.id=e.id;
		},
		data() {
			return {
				id:null,// 好友圈id
				content:'',//输入框的内容
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
				// 存储评论，返回上个页面
				request.putUpComments(this.id,this.content,(data)=>{
					if(data==1){
						uni.showToast({
							icon:'',
							title:"评论发表成功"
						});
						uni.navigateBack();
					}
				},(err)=>{
					uni.showToast({
						icon:'',
						title:"评论发表失败"
					});
				});
				
			},
		},
		computed:{
			canPutUp:function(){
				return this.content.length>0 ? false : true ;
			}
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.navBarCancel{
		width: @p33;
		color: @colorF;
		padding-left: 0.1*@u100;
	}
	.navBarTitle{
		width: @p33;
		color: @colorF;
		font-size: 0.4*@u100;
	}
	.navBarCancel image{
		height: 0.4*@u100;
		width: 0.4*@u100;
	}
	.navBarBtn{
		width: @p33;
		padding-right: 0.1*@u100;
	}
	button::after{ border: none;}
	.navBarBtn button[disabled]{
		background-color: @disableBtn;
		border: 0.01*@u100 solid @borderColor;
		height: 0.6*@u100;
		width: @u100;
		line-height: 0.6*@u100;
		border-radius: 0;
		color: @borderColor;
	}
	.navBarBtn button{
		background-color: @codeBorder;
		border: 0.01*@u100 solid @borderColor;
		height: 0.6*@u100;
		width: @u100;
		line-height: 0.6*@u100;
		border-radius: 0;
		color: @borderColor;
	}
	.writeComment{
		margin-top: @u100;
	}
	textarea{
		height: 3.5*@u100;	
		font-size: 0.3*@u100;	
		padding-top: 0.35*@u100;
		padding-left: 0.25*@u100;
	}
	
	/* 字数限制的样式 */
	.countLimit{
		bottom: 0.2*@u100;
		right: 0.3*@u100;
	}
</style>

