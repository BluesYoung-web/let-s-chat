<!-- 编辑资料 -->
<template>
	<view class="body">
		<view class="content flex flex-direction-column">
			<edit-item type="0" title="用户头像" :avatar="user.avatar" @poupChange="openPopup"></edit-item>
			<edit-item type="1" title="昵称" :content="user.nick" @toChange="toChangeName"></edit-item>
			<edit-item type="2" title="来聊账号" :content="user.uid" @cpoy="accountCopy"></edit-item>
			<edit-item type="1" title="个性签名" :content="user.motto" @toChange="toChangeMotto"></edit-item>
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
		<!-- 裁剪图片 -->
		<image-cropper :src="tempFilePath" @confirm="confirm"></image-cropper>
	</view>	
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	import editItem from '@/components/young-edit-item/young-edit-item.vue';
	import data from '@/data.js';
	export default {
		data() {
			return {
				user:{
					nick:"",//昵称
					motto:"",//签名
					uid:'',//账号
					avatar: "", //头像的地址
					phone:'', //手机号
					wxid:'' //微信id
				},
				showPopup: false, //控制弹出框是否显示
				tempFilePath: '',//要裁剪图片的路径
				cropFilePath: '',//裁剪后图片的路径
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
			//去修改昵称的页面
			toChangeName(){
				uni.navigateTo({
					url: `changeName?nick=${this.user.nick}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 去修改签名的页面
			toChangeMotto(){
				uni.navigateTo({
					url: `changeMotto?motto=${this.user.motto}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 打开修改头像面板
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
			// 长按自动复制账号
			accountCopy(){
				uni.setClipboardData({
					// data 必须是 string
					data:`${this.user.uid}`,
					success: () => {
						console.log('复制账号成功');
					}
				})
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
					},
					fail: res => {
						uni.showToast({
							title:"用户取消或加载超时",
							icon:"none"
						});
					},
				});
			},
			// 保存用户头像信息到state
			saveLogo(){
				data.user.set_info({
					data: this.user,
					success: (res) => {
						console.log(res);
					},
					fail: (code, err) => {
						console.log(code, err);
					}
				});
			},
			
			// 裁剪图片的相关方法
			// 确认裁剪
			confirm(e) {
				this.tempFilePath = ''
				this.cropFilePath = e.detail.tempFilePath;
				// 将裁剪后的图片上传到服务器
				data.user.upload({
					filePath:this.cropFilePath,
					name:"img",
					success:(res) => {
						console.log(res);
						if(res.status == 0){
							// 上传成功
							let url = res.data.url;
							this.user.avatar = url;
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
		components: {
			uniPopup,
			ImageCropper,
			editItem
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
	.avatarItem,.nameItem, .accountItem,.mottoItem{
		width: 100%;
		display: flex;
		align-items: center;
		color: @codeBorder;
		padding-left: 20upx;
		background-color: white;
		justify-content: space-between;
		padding-right: 30upx;
	}
	/* 头像项 */
	.avatarItem{
		height: 200upx;
		
	}
	.avatar{
		width: 150upx;
		height: 150upx;
		line-height: 150upx;
		border-radius: 8upx;
	}
	/* 昵称、账号、个性签名项 */
	.nameItem, .accountItem,.mottoItem{
		height: 100upx;
		margin-top: 20upx;
	}
	
	/* 右图标 */
	.rightIcon{
		width: 30upx;
		height: 30upx;
		margin-left: 30upx;
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
