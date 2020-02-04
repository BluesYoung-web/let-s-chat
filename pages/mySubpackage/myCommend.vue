<template>
	<!-- 历史被赞数 -->
	<view>
		<view class="likesSum" v-for="(item,index) in lists" :key="index">
			<view class="time flex flex-jc flex-vc">
				<text>{{item.time}}</text>
			</view>
			<view class="likesList flex flex-vc" @tap="toPeopInfo(item)">
				<image :src="item.avatar" mode=""></image>
				<view class="content">
					<text class="friend_name one-line-ellipsis">{{item.name}}</text>
				</view>
				<text class="flex-je">X {{item.countNum}}</text>
			</view>
		</view>
	</view>

</template>

<script>
	import service from '@/service.js';
	import request from '@/request/request.js';
	import {mapMutations,mapState} from 'vuex';
	export default {
		data() {
			return {
				lists: [
					// {
					// 	avatar: '/static/img/friendhead.png',
					// 	name: "小敏",
					// 	userId:'',
					//  countNum:1
					// },
				]
			}
		},
		computed:{
			...mapState(['likeMe'])
		},
		onLoad() {
			// 从state里面获取赞我的人的信息
			this.lists=this.likeMe;
		},
		methods: {
			//跳转到点赞人的详情页
			toPeopInfo(item) {
				let uid = item.userId;
				uni.navigateTo({
					url: `../../addressSubpackage/friendsInfo/friendsInfo?uid=${uid}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	page {
		background-color: @colorF7;
	}

	.likesSum {
		width: @p100;
	}

	.time {
		width: @p100;
		height: 0.7*@u100;
		font-size: 0.3*@u100;
	}

	.likesList {
		padding: 0.1*@u100;
		background-color: @colorF;
		height: 1.5*@u100;
	}

	.likesList image {
		display: inline-block;
		margin: 0.1*@u100;
		width: @u100;
		height: @u100;
		border: 1px solid @codeBorder;
		border-radius: 0.5*@p100;
	}
	.friend_name {
		width: 4*@u100;
	}
</style>
