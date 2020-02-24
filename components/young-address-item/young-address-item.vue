<template>
	<view class="zd">
		<!-- 联系人列表(正常显示) -->
		<view v-if="type == 'addressList'">
			<view class="flex flex-direction-row flex-vc flex-jsb width-750 height-120 pd-lr30" v-for="(item, index) in friendsList" :key="index">
				<image class="width-80 height-80 bd-rd50" :src="item.avatar" mode="aspectFill" @tap="toFriendInfo(item)"></image>
				<view class="width-600 flex flex-direction-row flex-jsb pd-lr20 h120 line-h120 bd-bt-gainsboro" @tap="toFriendInfo(item)">
					<text class="ft-32">{{item.nick}}</text>
					<text v-if="item.online" class="ft-28 color-f9aa33">在线</text>
					<text v-else class="ft-28 color-999">离线</text>
				</view>
			</view>
		</view>
		<!-- 创建群聊独有的样式 -->
		<view v-if="type == 'createChatRoom'">
			<checkbox-group @change="checkChange">
				<view class="uni-list" v-for="(item, index) in friendsList" :key="index">
					<label>
						<checkbox :value="item.uid+''"/>
						<image class="width-80 height-80 bd-rd50 inline-block" :src="item.avatar" mode="aspectFill"></image>
						<view class="width-500 mg-lt20 pd-lr20 inline-block bd-bt-gainsboro">
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

<style lang="less">
    /* 引入公共样式 */
	@import '~@/common/common.less';
</style>
