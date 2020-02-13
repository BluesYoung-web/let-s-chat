<!-- 编辑资料 -->
<template>
	<view class="body">
		<view class="content flex flex-direction-column">
			<view class="avatarItem" @click="openPopup">
				<text>用户头像</text>
				<view class="flex flex-vc">
					<image class="avatar" :src="user.avatar" mode="aspectFill"></image>
					<image class="rightIcon" src="/static/img/arrow-right.png" mode=""></image>
				</view>
			</view>
			<view class="nameItem" @tap="toChangeName">
				<text>昵称</text>
				<view class="flex flex-ac">
					<text class="inline-block width-400 one-line-ellipsis text-right ">{{user.nick}}</text>
					<image class="rightIcon" src="/static/img/arrow-right.png" mode=""></image>
				</view>
			</view>
			<view class="accountItem" @longpress="accountCopy">
				<text>来聊账号</text>
				<text>{{user.uid}}</text>
			</view>
			<view class="mottoItem" @tap="toChangeMotto">
				<text>个性签名</text>
				<view class="flex flex-ac">
					<text class="inline-block width-400 one-line-ellipsis text-right ">{{user.motto}}</text>
					<image class="rightIcon" src="/static/img/arrow-right.png" mode=""></image>
				</view>
			</view>
			
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
						setTimeout(() => {
							uni.hideToast();
						}, 1000);
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
						setTimeout(() => {
							uni.hideToast();
						}, 1000);
					}
				});
			},
		},
		components: {uniPopup,ImageCropper},
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	/* 设置页面背景色 */
	page{
		width: @p100;
		height: @p100;
		background-color: @bgcolor;
	}
	.avatarItem,.nameItem, .accountItem,.mottoItem{
		width: @p100;
		display: flex;
		align-items: center;
		color: @codeBorder;
		padding-left: 0.2*@u100;
		background-color: white;
		justify-content: space-between;
		padding-right: 0.3*@u100;
	}
	/* 头像项 */
	.avatarItem{
		height: 2*@u100;
		
	}
	.avatar{
		width: 1.5*@u100;
		height: 1.5*@u100;
		line-height: 1.5*@u100;
		border-radius: 0.08*@u100;
	}
	/* 昵称、账号、个性签名项 */
	.nameItem, .accountItem,.mottoItem{
		height: @u100;
		margin-top: 0.2*@u100;
	}
	
	/* 右图标 */
	.rightIcon{
		width: 0.3*@u100;
		height: 0.3*@u100;
		margin-left: 0.3*@u100;
	}
	
	
	/* 更换头像的弹出框 */
	.takePhoto, .photoAlbum, .cancel{
		background-color: @colorF;
		width: @p100;
		height: @u100;
		line-height: @u100;
		display: flex;
		justify-content: center;
		color:@codeBorder;
	}
	.cancel{
		margin-top: 0.2*@u100;
	}
</style>
