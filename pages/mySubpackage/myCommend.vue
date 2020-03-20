<template>
	<!-- 我的粉丝 -->
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
		onLoad() {
			// 从state里面获取赞我的人的信息
			// this.lists=this.likeMe;
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
		width: 100%;
	}

	.time {
		width: 100%;
		height: 70upx;
		font-size: 30upx;
	}

	.likesList {
		padding: 10upx;
		background-color: @colorF;
		height: 150upx;
	}

	.likesList image {
		display: inline-block;
		margin: 10upx;
		width: 100upx;
		height: 100upx;
		border: 1px solid @codeBorder;
		border-radius: 50%;
	}
	.friend_name {
		width: 400upx;
	}
</style>
