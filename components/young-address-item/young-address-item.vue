<template>
	<view class="zd">
		<!-- 联系人列表(正常显示) -->
		<view v-if="type == 'addressList'">
			<view class="flex flex-direction-row flex-vc flex-jsb width-750 height-120 pd-lr30" v-for="(item, index) in friendsList" :key="index">
				<image class="width-80 height-80 bd-rd50" :src="item.avatar" mode="aspectFill" @tap="toFriendInfo(item)"></image>
				<view class="width-600 flex flex-direction-row flex-jsb pd-lr20 h120 line-h120 bd-bt-gainsboro" @tap="toFriendInfo(item)">
					<text class="ft-32">{{item.nick}}</text>
					<view v-if="showStatus">
						<text v-if="item.online" class="ft-28 color-f9aa33">在线</text>
						<text v-else class="ft-28 color-999">离线</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 创建群聊独有的样式 -->
		<view v-if="type == 'createChatRoom'">
			<checkbox-group @change="checkChange">
				<view class="uni-list" v-for="(item, index) in friendsList" :key="index">
					<label>
						<checkbox class="ckbox" :value="item.uid+''"/>
						<image class="img width-80 height-80 bd-rd50 inline-block" :src="item.avatar" mode="aspectFill"></image>
						<view class="nick width-500 mg-lt20 pd-lr20 inline-block bd-bt-gainsboro">
							<text class="ft-32">{{item.nick}}</text>
						</view>
					</label>
				</view>
			</checkbox-group>
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
			/**
			 * 用于样式控制
			 */
			type: {
				type: String,
				default(){
					return 'addressList'
				}
			},
			/**
			 * 好友列表
			 */
			friendsList: {
				type: Array,
				default(){
					return []
				}
			},
			/**
			 * 是否显示在线状态
			 */
			showStatus: {
				type: [String,Boolean],
				default(){
					return true;
				}
			}
		},
		methods:{
			/**
			 * 点击进入好友详情页
			 */
			toFriendInfo(item){
				this.$emit('toFriendInfo', item);
			},
			/**
			 * 勾选了
			 */
			checkChange(e){
				let arr = e.detail.value;
				this.$emit('checkChange', arr);
			}
		}
	}
</script>

<style>
	.uni-list{
		position: relative;
	}
	.ckbox{
		position: absolute;
		z-index: -1;
	}
	.img{
		position: relative;
		left: 100upx;
		top: -10upx;
		z-index: -1;
	}
	.nick{
		position: relative;
		z-index: -1;
		left: 100upx;
		top: -30upx;
	}
	.mg-lt20{
		margin-left: 20upx;
	}
	.inline-block {
		display: inline-block;
	}
	.color-f9aa33{
		color: #f9aa33;
	}
	.color-999{
		color: #999;
	}
	.ft-32{
		font-size: 32upx;
	}
	.ft-28{
		font-size: 28upx;
	}
	.bd-bt-gainsboro{
		border-bottom: 1px solid #F1F1F1;
	}
	.line-h120{
		line-height: 120upx;
	}
	.bd-rd50{
		border-radius: 50% !important;
	}
	.width-750{
		width: 750upx;
	}
	.width-600{
		width: 600upx;
	}
	.width-500{
		width: 500upx;
	}
	.width-80{
		width: 80upx;
	}
	.height-120, .h120{
		height: 120upx;
	}
	.height-80{
		height: 80upx;
	}
	.pd-lr30{
		padding: 0 30upx;
	}
	.pd-lr20{
		padding: 0 20upx;
	}
    .flex {
		display: box; /* OLD - Android 4.4- */
		display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
		display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
		display: -ms-flexbox; /* TWEENER - IE 10 */
		display: -webkit-flex; /* NEW - Chrome */
		display: flex;
	}
	/* 垂直居中 */
	.flex-vc {
		/* 09版 */
		-webkit-box-align: center;
		/* 12版 */
		-webkit-align-items: center;
		-moz-align-items: center;
		-ms-align-items: center;
		-o-align-items: center;
		align-items: center;
	}
	/* 水平居中 */
	.flex-hc {
		/* 09版 */
		-webkit-box-pack: center;
		/* 12版 */
		-webkit-justify-content: center;
		-moz-justify-content: center;
		-ms-justify-content: center;
		-o-justify-content: center;
		justify-content: center;
	}
	/* 按行排列 */
	.flex-direction-row{
		flex-direction: row;
	}
	.flex-jsb { 
		justify-content: space-between;
	}
	.flex-ac { 
		align-items: center;
	}
</style>
