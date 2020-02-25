<template>
	<view>
		<!-- 首部头像下的背景颜色 -->
		<view class="topBg width-full bg-344955 absolute"></view>
		<!-- 头像 -->
		<view class="flex flex-jc">
			<view class="avatar mg-tp20" @tap="checkImg">
				<image :src="user.avatar" mode="scaleToFill" v-if="user.avatar"></image>
				<!-- 默认头像 -->
				<image src="/static/img/defaultHead.jpg" mode="aspectFill" v-else></image>
			</view>
		</view>
		<!-- 昵称资料 -->
		<view class="messageContent mg-tp60 flex flex-direction-column flex-vc">
			<!-- 昵称 -->
			<view class="name ft-36 font-weight-600 color-344955 one-line-ellipsis">
				<text>{{user.nick}}</text>
			</view>
			<!-- 来聊账号 -->
			<view class="account ft-26 color-889aa3 mg-tp15">
				<text>来聊账号：</text>
				<text>{{user.uid}}</text>
			</view>
			<!-- 签名 -->
			<view class="motto ft-26 color-889aa3 mg-tp20 one-line-ellipsis">
				<text>{{user.motto}}</text>
			</view>
			
			<!-- 编辑资料按钮 -->
			<button class="editInfoBtn bg-889aa3 color-889aa3 mg-tp60"  plain="true" 
			@tap="clickButton" v-text="buttonText"></button>
			
			<!-- 下方的赞&关注&发表 -->
			<view class="flex flex-direction-row flex-hc width-750">
				<!-- 赞 -->
				<view class="myCommend" @tap="goTo('toMyCommend')">
					<text class="color-889aa3 ft-26">赞</text>
					<text class="color-4A6572 ft-28 mg-tp15">{{commendNum}}</text>
				</view>
				<!-- 关注 -->
				<view class="myFocus" @tap="goTo('toMyFocus')">
					<text class="color-889aa3 ft-26">关注</text>
					<text class="color-4A6572 ft-28 mg-tp15">{{focusNum}}</text>
				</view>
				<!-- 发表 -->
				<view class="myRelease" @tap="goTo('toMyRelease')">
					<text class="color-889aa3 ft-26">发表</text>
					<text class="color-4A6572 ft-28 mg-tp15">{{releaseNum}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		/**
		 * 组件名
		 */
		name: 'personInfo',
		/**
		 * 组件属性
		 */
		props: {
			user: {
				type: Object,
				default(){
					return {}
				}
			},
			buttonText: {
				type: String,
				default: '按钮'
			},
			commendNum: {
				type: [Number, String],
				default: 0
			},
			focusNum: {
				type: [Number, String],
				default: 0
			},
			releaseNum: {
				type: [Number, String],
				default: 0
			},
		},
		methods:{
			/**
			 * 查看图片
			 */
			checkImg(){
				this.$emit('checkImg', this.user.avatar);
			},
			/**
			 * 按钮
			 */
			clickButton(){
				this.$emit('clickButton');
			},
			/**
			 * 去我点赞过的、关注我的、我发表的
			 */
			goTo(str){
				this.$emit(str, this.user.uid);
			}		
		}
	}
</script>

<style lang="less">
	/* 引入公共样式 */
	@import "~@/common/common.less";
	/* 首部头像下的背景颜色 */
	.topBg{
		height: 350upx;
		top: 0;
		z-index: -1;
	}
	/* 头像 */
	.avatar{
		width: 500upx;
		height: 500upx;
		box-shadow:0 2upx 50upx 0 @codeBorder;
		display: flex;
		justify-content: center;
	}
	.avatar image{
		width: 500upx;
		height: 500upx;
	}
	/* 编辑资料按钮 */
	.editInfoBtn,.editInformation{
		border: 1px solid @codeBorder;
		border-radius: 8upx;
		width: 320upx;
		color: @codeBorder;
	}
	/* 赞 关注 发表 */
	.myCommend,.myFocus,.myRelease{
		width: 33%;
		height: 200upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.name, .motto{
		width: 400upx;
		text-align: center;
	}
</style>
