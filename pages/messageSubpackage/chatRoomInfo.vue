<!-- 编辑资料 -->
<template>
	<view class="body">
		<view class="content flex flex-direction-column">
			<edit-item type="0" title="群聊头像" :avatar="roomInfo.avatar" @poupChange="openPopup"></edit-item>
			<edit-item type="1" title="群名" :content="roomInfo.title" @toChange="toChangeName"></edit-item>
			<chat-room-users :users="users" @clickAvatar="toUserInfo" @clickPlus="invite"></chat-room-users>
			<edit-item type="3" content="退出该群" @poupChange="quit"></edit-item>
		</view>
		<!-- 更换头像的弹出框 -->
		<uni-popup :show="showPopup" type="bottom"  @change="change">
			<view class="bg-edf0f2 width-750">
				<!-- 拍照 -->
				<view class="takePhoto" @click="takePhoto">
					<text>拍照</text>
				</view>
				<!-- 相册 -->
				<view class="photoAlbum" @click="photoAlbum">
					<text>从相册选择</text>
				</view>
				
				<!-- 关闭弹出框 -->
				<view class="cancel" @click="closePopup">
					<text class="color-red">取消</text>
				</view>
			</view>
		</uni-popup>
	</view>	
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import editItem from '@/components/young-edit-item/young-edit-item.vue';
	import chatRoomUsers from '@/components/young-chat-room-users/young-chat-room-users.vue';
	import data from '@/data.js';
	export default {
		components: {
			uniPopup,
			editItem,
			chatRoomUsers,
		},
		data() {
			return {
				roomId: null,
				roomInfo:{},
				users: [],
				showPopup: false, //控制弹出框是否显示
				tempFilePath: '',//图片的路径,
			}
		},
		onLoad(e){
			this.roomId = e.roomId;
		},
		onShow() {
			this.users = [];
			data.chat.get_room_info({
				roomId: this.roomId,
				success: (res) => {
					this.roomInfo = res;
					for (const iterator of this.roomInfo.users) {
						data.friend.get_info({
							uid: iterator,
							success: (dt) => {
								this.users.push(dt);
							}
						});
					}
				}
			});
		},
		methods: {
			/**
			 * 点击用户头像，进入用户详情页
			 */
			toUserInfo(uid){
				uni.navigateTo({
					url: `/pages/addressSubpackage/friendsInfo?uid=${uid}`
				});
			},
			/**
			 * 拉人进群
			 */
			invite(){
				uni.navigateTo({
					url: `/pages/messageSubpackage/inviteToChatRoom?roomId=${this.roomId}`
				});
			},
			/**
			 * 退群
			 */
			quit(){
				uni.showModal({
					title: '确定退出该群？',
					content: '将同时删除聊天记录',
					success: (res) => {
						if (res.confirm) {
							data.chat.quit({
								roomId: this.roomId,
								success: (res) => {
									console.log(res);
									// 删记录
									data.chat.clear_chat_log_list({
										roomId: this.roomId,
										success: () => {
											uni.showToast({
												title: '退出群聊成功'
											});
											uni.reLaunch({
												url:'/pages/tabBar/message'
											});
										}
									});
								}
							});
						}
					}
				});
			},
			/**
			 * 修改群名
			 */
			toChangeName(){
				uni.navigateTo({
					url: `changeChatRoomName?roomId=${this.roomId}`
				});
			},
			/**
			 * 修改群头像
			 */
			openPopup(){
				this.showPopup = true;
			},
			//关闭修改头像面板
			closePopup(){
				this.showPopup = false;
			},
			//配合点击空白处关闭面板的函数
			change(e){
				if (!e.show){
					this.showPopup = false;
				}
			},
			// 拍照
			takePhoto(){
				this.chooseImg('camera');
			},
			// 从相册选择
			photoAlbum(){
				this.chooseImg('album');
			},
			chooseImg(type){
				uni.chooseImage({
					count: 1,
					sourceType:[type],
					success: res => {
						// console.log(JSON.stringify(res.tempFilePaths));
						//裁剪图片的路径
						this.tempFilePath = res.tempFilePaths.shift();
						this.upload();
					},
					fail: res => {
						uni.showToast({
							title:"用户取消或加载超时",
							icon:"none"
						});
					},
				});
			},
			/**
			 * 更新本地缓存
			 */
			saveLogo(){
				data.chat.set_room_info({
					roomInfo: this.roomInfo,
					success: (res) => {
						console.log(res);
					},
					fail: (code, err) => {
						console.log(code, err);
					}
				});
			},
			
			/**
			 * 图片上传
			 */
			upload() {
				// 将裁剪后的图片上传到服务器
				data.user.upload({
					filePath:this.tempFilePath,
					name:"img",
					success:(res) => {
						console.log(res);
						if(res.status == 0){
							// 上传成功
							let url = res.data.url;
							this.roomInfo.avatar = url;
							this.saveLogo();
							uni.showToast({
								title:"更换成功！"
							});
						}else{
							uni.showToast({
								title:"更换失败！"
							});
						}
						this.showPopup = false;
					}
				});
			},
		},
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	/* 设置页面背景色 */
	page{
		width: 100%;
		height: 1005;
		background-color: @bgcolor;
	}
	/* 更换头像的弹出框 */
	.takePhoto, .photoAlbum, .cancel{
		background-color: @colorF;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		display: flex;
		justify-content: center;
		color:@codeBorder;
	}
	.cancel{
		margin-top: 20upx;
	}
</style>
