<template>
	<view>
		<view v-for="(item,index) in dataList" :key="index">
			<uni-swipe-action>
				<!-- 如果没有置顶 -->
				<uni-swipe-action-item v-if="item.isTop == 0" :options="options" @click="onClickChoice($event, item, index)">
					<view class="height-200 flex flex-direction-row flex-vc pd-lr20" @tap="onClick(item)">
						<!-- 朋友头像框 -->
						<view class="message-head relative">
							<image class="width-120 height-120 bd-rd50" :src="item.imgUrl" mode="aspectFill"></image>
							<!-- 未读消息的角标 -->
							<text v-if="0 < item.msgNum && item.msgNum <= 99" class="icon">{{item.msgNum}}</text>
							<text v-if="item.msgNum > 99" class="icon">99+</text>
						</view>
						<!-- 消息内容 -->
						<view class="message-body flex flex-direction-column flex-jc pd-lt15">
							<view class="message-informatin flex flex-jsb">
								<span class="ft-34">{{item.nick}}</span>
								<span class="color-ccc">{{item.time}}</span>
							</view>
							<view class="message-content one-line-ellipsis mg-tp30 color-999">{{item.content}}</view>
						</view>
					</view>
				</uni-swipe-action-item>
				<!-- 已经置顶了 -->
				<uni-swipe-action-item v-else :options="options1" @click="onClickChoice($event, item, index)">
					<view :style="{'backgroundColor':(item.isTop == 1 ? 'aliceblue' : '#fff')}" class="height-200 flex flex-direction-row flex-vc pd-lr20" @tap="onClick(item)">
						<!-- 朋友头像框 -->
						<view class="message-head relative">
							<image class="width-120 height-120 bd-rd50" :src="item.imgUrl" mode="aspectFill"></image>
							<!-- 未读消息的角标 -->
							<text v-if="0 < item.msgNum && item.msgNum <= 99" class="icon">{{item.msgNum}}</text>
							<text v-if="item.msgNum > 99" class="icon">99+</text>
						</view>
						<!-- 消息内容 -->
						<view class="message-body flex flex-direction-column flex-jc pd-lt15">
							<view class="message-informatin flex flex-jsb">
								<span class="ft-34">{{item.nick}}</span>
								<span class="color-ccc">{{item.time}}</span>
							</view>
							<view class="message-content one-line-ellipsis mg-tp30 color-999">{{item.content}}</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
	export default {
		/**
		 * 组件名
		 */
		name: "chatItem",
		/**
		 * 第三方组件
		 */
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		/**
		 * 组件属性
		 */
		props: {
			dataList: {
				type: Array,
				default () {
					return []
				}
			},
			options: {
				type: Array,
				default(){
					return []
				}
			},
			options1: {
				type: Array,
				default(){
					return []
				}
			}
		},
		data(){
			return {}
		}
	}
</script>

<style>
	@import url("./common.css");
	/* 未读消息角标 */
	.icon {
		position: absolute;
		top: 0upx;
		left: 80upx;
		font-size: 20upx;
		color: white;
		display: block;
		padding-left: 10upx;
		padding-right: 10upx;
		background-color: #F43530;
		border-radius: 40upx;
	}
	/* 消息主体 */
	.message-body{
		width: 600upx;
		height: 200upx;
		border-bottom: 1px solid #EEEEEE;
	}
	/* 消息内容 */
	.message-content{
		width: 500upx;
	}
	/* 常用样式 */
	
</style>