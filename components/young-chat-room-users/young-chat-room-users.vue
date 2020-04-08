<template>
	<view>
		<view class="chatRoomUsers">
			<text class="chatRoomUsers-text">群成员</text>
			<view class="userInfo">
				<view class="userHead" v-for="(item, index) in users" :key="index">
					<image :src="item.avatar" mode="" @tap="clickAvatar(item.uid)"></image>
				</view>
				<view class="userHead">
					<image class="plus" :src="plusSrc" mode="" @tap="clickPlus"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'chatRoomUsers',
		props: {
			users: {
				type: Array,
				default(){
					return [];
				}
			},
			plusSrc: {
				type: String,
				default: '/static/img/conversation/plus.png'
			}
		},
		methods:{
			clickAvatar(uid){
				this.$emit('clickAvatar', uid);
			},
			clickPlus(){
				this.$emit('clickPlus');
			}
		}
	}
</script>

<style>
	.chatRoomUsers{
		margin-top: 20upx;
		background-color: #fff;
		width: 750upx;
		display: flex;
		flex-direction: column;
	}
	.chatRoomUsers-text{
		text-align: center;
		flex: 1;
		margin-bottom: 20upx;
		font-size: 40upx;
	}
	.userInfo{
		display: inline-flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.userHead{
		width: 100upx;
		height: 100upx;
		display: inline-flex;
		justify-content: center;
		vertical-align: center;
	}
	.userHead image{
		height: 65upx;
		width: 65upx;
		text-align: center;
		display: inline-flex;
		border: 1upx solid #344955;
		border-radius: 50%;
	}
	.plus{
		background-color: #CCCCCC;
		border: 1px solid #CCCCCC !important;
	}
</style>
