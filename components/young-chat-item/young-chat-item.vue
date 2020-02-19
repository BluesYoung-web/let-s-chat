<template>
	<view>
		<scroll-view scroll-y="true" >
			<view class="flex flex-direction-column flex-vc" v-if="!dataList[0]">
				<image src="/static/img/emptylogo.png" mode="aspectFit"></image>
				<text class="color-344955">空空如也~</text>
				<text class="ft-26 color-999">赶快去聊天吧</text>
			</view>
			<view v-for="(item,index) in dataList" :key="index">
				<uni-swipe-action>
					<!-- 如果没有置顶 -->
					<uni-swipe-action-item v-if="item.isTop == 0" :options="options" @click="onClickChoice($event, item, index)">
						<view class="height-200 flex flex-direction-row flex-vc pd-lr20" @click="onClickInto(item)">
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
						<view :style="{'backgroundColor':(item.isTop == 1 ? 'aliceblue' : '#fff')}" class="height-200 flex flex-direction-row flex-vc pd-lr20">
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
		</scroll-view>
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
		 * 依赖第三方组件
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
					return [{
						text: '置顶',
						style: {
							backgroundColor: 'rgb(199, 198, 205)'
						}
					},{
						text: '标记为已读',
						style: {
							backgroundColor: 'rgb(254, 156, 1)'
						}
					},{
						text: '删除',
						style: {
							backgroundColor: 'rgb(255,58,49)'
						}
					}]
				}
			},
			options1: {
				type: Array,
				default(){
					return [{
						text: '取消置顶',
						style: {
							backgroundColor: 'rgb(199, 198, 205)'
						}
					},{
						text: '标记为已读',
						style: {
							backgroundColor: 'rgb(254, 156, 1)'
						}
					},{
						text: '删除',
						style: {
							backgroundColor: 'rgb(255,58,49)'
						}
					}]
				}
			},
		},
		data(){
			return {}
		},
		/**
		 * 处理显示的时间
		 */
		created(){
			for (let i in this.dataList) {
				this.dataList[i].time = this.timeFormat(this.dataList[i].ot);
			}
		},
		methods: {
			/**
			 * 将时间戳转换成特定格式的时间
			 * @param {timestamp} timestamp 时间戳
			 * @return {string} str 处理后的时间
			 */
			timeFormat(timestamp){
				if(!Number(timestamp)){
					return timestamp;
				}
				const nowTime = Date.parse(new Date());
				let d = nowTime - timestamp;
				let str = '';
				if(d < 86400000){
					// 显示时间
					str = new Date(timestamp).toTimeString().substr(0,5);
					
				}else if(d > 86400000 && d < 172800000){
					// 显示昨天+时间
					str = "昨天"+new Date(timestamp - 86400000).toTimeString().substr(0,5);
				}else{
					// 直接显示日期+时间
					let t = new Date(timestamp);
					str = `${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日`;
				}
				return str;
			},
			/**
			 * 直接点击聊天项
			 * @param {Object} item
			 */
			onClickInto(item){
				// 触发父级组件的监听
				this.$emit("clickInto", item);
			},
			/**
			 * 滑动选项
			 * @param {Object} $event
			 * @param {Object} item
			 * @param {Object} index
			 */
			onClickChoice(event, item, index){
				// 触发父级组件的监听
				this.$emit("clickChoice", event, item, index);
			}
		},
	}
</script>

<style lang="less">
    /* 引入公共样式 */
    @import '~@/common/common.less';
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
</style>