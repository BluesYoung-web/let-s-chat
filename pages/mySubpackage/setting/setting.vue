<!-- 设置 -->
<template>
	<view>
		<view class="">
			<view class="setList">
				<!-- 更换手机号 -->
				<edit-item type="1" :title="user.tel ? '更换手机号' : '绑定手机号'" @toChange="toChangePhone"></edit-item>
				<!-- 关于来聊 -->
				<edit-item type="1" title="关于来聊" @toChange="toAboutUs"></edit-item>
				<!-- 清空聊天记录 -->
				<edit-item type="3" content="清空聊天记录" @poupChange="showPopup('clearChatLogPopup')"></edit-item>
				<!-- 退出登录 -->
				<edit-item type="3" content="退出登录" @poupChange="showPopup('signOutPopup')"></edit-item>
			</view>
		</view>
		
		
		<!-- 清空聊天记录的弹出层 -->
		<uni-popup :show="showclearChatLogPopup" type="bottom" @change="popupChange">
			<view class="bg-edf0f2 width-750 flex flex-direction-column flex-vc">
				<!-- 提示 -->
				<view class="item ft-30 color-344955">
					<text>将删除所有个人聊天记录</text>
				</view>
				<!-- 清空聊天记录按钮 -->
				<view class="item height-100 " @click="clearChatLog">
					<text class="color-red ft-36">清空聊天记录</text>
				</view>
				
				<!-- 关闭弹出框 -->
				<view class="item mg-tp20" @click="closePopup" data-cancel="clearChatLogPopup">
					<text class="color-344955 ft-34 font-weight-550">取消</text>
				</view>
			</view>
		</uni-popup>
		
		<!-- 退出登录的弹出层 -->
		<uni-popup :show="showsignOutPopup" type="bottom" @change="popupChange">
			<view class="bg-edf0f2 width-750">
				<!-- 提示 -->
				<view class="item ft-30 color-344955">
					<text>退出登录后不会删除历史数据</text>
				</view>
				<!-- 清空聊天记录按钮 -->
				<view class="item height-100 " @click="signOut">
					<text class="color-red ft-36">退出登录</text>
				</view>
				
				<!--关闭弹出框 -->
				<view class="item mg-tp20" @click="closePopup"  data-cancel="signOutPopup">
					<text class="color-344955 ft-34 font-weight-550">取消</text>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import editItem from '@/components/young-edit-item/young-edit-item.vue';
	import data from '@/data.js';
	export default {
		data() {
			return {
				showsignOutPopup:false, //是否弹出退出登录面板
				showclearChatLogPopup:false, //是否弹出清空聊天记录面板
				user: {}
			}
		},
		onShow() {
			data.user.get_info({
				success: (res) => {
					this.user = res;
				}
			});
		},
		methods: {
			// 跳转到关于来聊的页面
			toAboutUs(){
				uni.navigateTo({
					url: 'aboutUs',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 跳转更换/绑定手机号页面
			toChangePhone(){
				let isBind = this.user.tel ? "changePhone" : "bindPhone";
				uni.navigateTo({
					url: `${isBind}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			
			// 清除聊天记录
			clearChatLog(){
				uni.showModal({
					title:"提示",
					content:"确定要清除聊天记录吗?",
					success: (res) => {
						if(res.confirm == true){
							// ....
							uni.showToast({
								title:"清除成功"
							});
							// 跳转到消息页
							uni.reLaunch({
								url: "/pages/tabBar/message/message"
							});
						};
					},
					fail: (res) => {
						uni.showToast({
							title:"清除失败"
						});
					}
				});
				setTimeout(() => {
					uni.hideToast();
				}, 1000);
				this.showclearChatLogPopup = false;
			},
			
			// 退出登录
			signOut(){
				uni.showModal({
					title:"提示",
					content:"确定要退出登录吗?",
					success: (res) => {
						if(res.confirm == true){
							data.user.login_out();
							uni.reLaunch({
								url: "/pages/common/login"
							});
						};
						
					},
					fail: (res) => {
						uni.showToast({
							title:"网络延迟"
						})
					}
				});
				setTimeout(() => {
					uni.hideToast();
				}, 1000);
			},
			
			// ------------------底部弹出层有关的函数-----------------------
			// 弹出底部面板：清空聊天记录 & 退出登录
			showPopup(e){
				let a = 'show' + e;
				this[a] = true;
			},
			// 点击取消
			closePopup(e){
				let a = 'show' + e.currentTarget.dataset.cancel;
				// console.log(e.currentTarget.dataset.cancel);
				this[a] = false;
			},
			//配合点击空白处关闭面板的函数
			popupChange(e){
				if (!e.show){
					this.showsignOutPopup = false;
					this.showclearChatLogPopup = false;
				}
			},
		},
		components: {
			uniPopup,
			editItem,
			},
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	page{
		background-color: @bgcolor;
	}
	.changePhoneItem, .aboutItem, .clearItem, .signOutItem{
		height: 100upx;
		background-color: @colorF;
		margin-bottom: 20upx;
	}
	
	/* 右图标 */
	.rightIcon{
		width: 30upx;
		height: 30upx;
		margin-left: 30upx;
	}
	
	
	/* 弹出层样式集合 */
	.item{
		background-color: @colorF;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		display: flex;
		justify-content: center;
	}
</style>
