<template>
	<view>
		<!-- 群列表 -->
		<view class="bg-fff pd-tp20" v-if="chatRoomList.length > 0">
			<span class="contacts-text">群</span>
			<address-item :friendsList="chatRoomList" :showStatus="false"
			@toFriendInfo="toChatRoom"></address-item>
		</view>
		<!-- 为空时 -->
		<view class="flex flex-direction-column flex-vc" v-else>
			<image src="/static/img/emptylogo.png" mode="aspectFit"></image>
			<text class="color-344955">空空如也~</text>
			<text class="ft-26 color-999">赶快去加群吧</text>
		</view>
	</view>
</template>

<script>
	import data from '@/data.js';
	import addressItem from '@/components/young-address-item/young-address-item.vue';
	export default {
		components:{
			addressItem
		},
		data() {
			return {
				chatRoomList: []
			}
		},
		onShow() {
			this.chatRoomList = [];
			data.chat.get_my_qun({
				success: (res) => {
					for (let s of res) {
						data.chat.get_room_info({
							roomId: s,
							success: (tp) => {
								this.chatRoomList.push(tp);
							}
						});
					}
				}
			});
		},
		methods: {
			/**
			 * 进入聊天室
			 */
			toChatRoom(item){
				let roomId = item.id;
				uni.navigateTo({
					url: `/pages/messageSubpackage/conversation?roomId=${roomId}`
				});
			}
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.contacts-text{
		font-size: 36upx;
		color: #344955;
		margin-left: 30upx;
	}
</style>
