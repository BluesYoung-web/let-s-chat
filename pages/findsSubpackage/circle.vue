<template>
	<!-- 好友圈界面 -->
	<view class="content">
		<scroll-view enable-back-to-top="true" scroll-y="true" :scroll-top="scrollTop" :style="{height:scrollHeight + 'px'}"
		@scroll="scroll" refresher-enabled="true" :refresher-triggered="triggered"
		:refresher-threshold="45" refresher-background="#666" @refresherrefresh="onRefresh" 
		@refresherrestore="onRestore" @refresherabort="onAbort">		 	
			<!-- 一个好友圈动态 -->
			<view class="finds-body" v-for="(item,index) in findsList" :key="index">
				<find-item :item="item" @watchImg="watchImg" @like="like" @comment="comment"></find-item>
			</view>
			<back-top src="/static/img/top.png" :scrollTop="old.scrollTop" 
			@toTopClick="goTop"></back-top>
			<edit-item type="3" :content="loadingText" @poupChange="showMore"></edit-item>
		</scroll-view>

		<!-- 发表动态弹出层 -->
		<uni-popup class="" :show="popup" type="center" @change="popupChange">
			<view class="width-600 bg-fff bd-rd10 ov-hd">
				<view @touchstart="changeCol(1)" @touchend="takepho(1)" class="bd-bt-gainsboro width-600 height-100 pd-lt20 flex flex-vc"
				 :style="{'background-color':color1}">
					<text>拍摄</text>
				</view>
				<view @touchstart="changeCol(2)" @touchend="takepho(2)" class="width-600 height-100 pd-lt20 flex flex-vc" :style="{'background-color':color2}">
					<text>从相册选择</text>
				</view>
			</view>
		</uni-popup>

		<!-- 确定发表提示框 -->
		<uni-popup :show="toast" @change="toastChange" :maskClick="false">
			<view class="bg-fff width-600 bd-rd14 ov-hd">
				<view class="titleTip height-100 pd-lt40 pd-tp20">
					<text class="ft-32">确定发表吗</text>
				</view>
				<view class="say">
					<input type="text" v-model="say" placeholder="说点什么吧..."/>
				</view>
				<view class="height-600">
					<image class="width-600" :src="findsImgUrl" mode="aspectFit"></image>
				</view>
				<view class="flex flex-direction-row ">
					<button @click="submitFinds" type="" class="btn">发表</button>
					<button @click="cancelSubmit" type="" class="btn">取消</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import findItem from "@/components/young-find-item/young-find-item.vue";
	import editItem from "@/components/young-edit-item/young-edit-item.vue";
	import backTop from "@/components/young-back-top/young-back-top.vue";
	import data from '@/data.js';
	export default {
		components: {
			uniPopup,
			findItem,
			backTop,
			editItem
		},
		mounted() {
			//高度自适应
			this.scrollHeight = uni.getSystemInfoSync().windowHeight;
		},
		data() {
			return {
				/**
				 * 自定义下拉刷新状态
				 */
				triggered: false,
				/**
				 * 刷新标志
				 */
				freshing: false,
				page: 1,
				user: null,
				pagecount: null,
				//点击加载更多
				loadingText: '点击加载更多...',
				say: '',
				scrollHeight: '',
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				findsList: [],
				popup: false, //拍照面板是否显示
				color1: '', //拍照弹出框拍摄view颜色
				color2: '', //拍照弹出框相册view颜色
				toast: false, //确认发表提示框
				findsImgUrl: "", //发表的图片路径
			}
		},
		onLoad(){
			this.freshing = false;
			setTimeout(() => {
				this.triggered = true;
			}, 1000);
			this.getnewsList(1);
			data.user.get_info({
				success: (res) => {
					this.user = res;
				}
			});
		},
		onShow() {
			// #ifdef APP-PLUS
			this.onRefresh();
			// #endif
		},
		// 监听发表动态按钮的点击事件
		onNavigationBarButtonTap(e) {
			this.popup = true;
		},
		methods: {
			/**
			 * 从服务器获取最新数据
			 */
			getLatest(){
				this.findsList = [];
				this.loadingText = '点击加载更多...';
				// 从服务器拉取新数据
				this.getnewsList(1, true);
			},
			/**
			 * 自定义下拉刷新
			 */
			onRefresh(){
				if (this.freshing) {
					return;
				} else {
					this.freshing = true;
					this.getLatest();
					setTimeout(() => {
						this.freshing = false;
						this.triggered = false;
					}, 1500);
				}
			},
			/**
			 * 复位下拉刷新
			 */
			onRestore() {
                this.triggered = 'restore'; // 需要重置
                console.log("onRestore");
			},
			/**
			 * 终止下拉刷新
			 */
            onAbort() {
                console.log("onAbort");
            },
			/**
			 * 前往用户信息页面
			 * @param {number} uid
			 */
			toFriendsInfo(uid){
				uni.navigateTo({
					url: `/pages/addressSubpackage/friendsInfo?uid=${uid}`,
				});
			},
			/**
			 * 滚动事件
			 * @param {Object} e
			 */
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			/**
			 * 回顶部
			 * @param {Object} e
			 */
			goTop(e) {
				this.scrollTop = this.old.scrollTop;
				// 5毛动画
				let it = setInterval(() => {
					if(this.scrollTop){
						this.scrollTop -= 10;
					}
				}, 10);
				if (this.scrollTop + 10 > 3000) {
					setTimeout(() => {
						clearInterval(it);
						this.scrollTop = 0;
					}, 3000);
				} else{
					setTimeout(() => {
						clearInterval(it);
					}, this.scrollTop + 10);
				}
			},
			/**
			 * 点赞
			 * @param {object} e 单条朋友圈对象
			 */
			like(e) {
				console.log(e.likeAction);
				// 服务器相关操作
				if (! e.likeAction) {
					data.find.like({
						findId: e.id,
						success: () => {
							e.likeAction = 1;
							e.likesNum++;
						},
						fail: (code, err) => {
							console.log(code, err);
						}
					});
				} else {
					data.find.dislike({
						findId: e.id,
						success: () => {
							e.likeAction = 0;
							e.likesNum--;
						},
						fail: (code, err) => {
							console.log(code, err);
						}
					});
				}
			},
			/**
			 * 评论
			 * @param {object} e 单条朋友圈对象
			 */
			comment(e) {
				// 跳转到评论详情页
				uni.navigateTo({
					url: `/pages/findsSubpackage/comments?id=${e.id}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},

			// ------------------弹出层有关的函数-----------------------
			//点击改变view颜色
			changeCol(flag) {
				console.log(1)
				this['color' + flag] = '#E5E5E5'
			},
			takepho(flag) {
				this['color' + flag] = '#fff'
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], 
					sourceType: [flag == 1 ? 'camera' : 'album'], //根据传入的flag判断是否从相册选择
					success: (res) => {
						this.findsImgUrl = res.tempFilePaths[0];
						console.log(this.findsImgUrl);
						this.popup = false;
						this.toast = true;
					},
					fail: (res) => {
						this.popup = false;
						uni.showToast({
							icon: "none",
							title: "取消或设备请求超时"
						});
					}
				});
			},

			// 确认发表
			submitFinds() {
				this.toast = false;
				uni.showLoading({
					title: "发布中"
				});
				// 将图片上传到服务器
				data.user.upload({
					filePath: this.findsImgUrl,
					name: 'img',
					success:(res) => {
						console.log(res);
						if(res.status == 0){
							// 上传成功
							this.findsImgUrl = res.data.url;
							this.putup();
						}else{
							uni.hideLoading();
							uni.showToast({
								title:"图片上传失败！"
							});
						}
					}
				});
			},
			/**
			 * 发表
			 */
			putup(){
				let dt = {
					ot: Date.parse(new Date()),
					img: this.findsImgUrl, 
					say: this.say
				}
				data.find.put_up({
					data: dt,
					success: () => {
						uni.hideLoading();
						uni.showToast({
							title: '好友圈发布成功！'
						});
						this.getLatest();
					},
					fail: (code, err) => {
						uni.hideLoading();
						console.log(code, err);
					}
				});
			},
			// 取消发表
			cancelSubmit() {
				this.toast = false;
			},
			//配合点击空白处关闭面板的函数
			popupChange(e) {
				if (!e.show) {
					this.popup = false;
				}
			},
			toastChange(e) {
				if (!e.show) {
					this.toast = false;
				}
			},

			// 查看图片
			watchImg(src) {
				uni.previewImage({
					urls: [src],
					longPressActions: {
						itemList: ['保存图片'],
						success: (data)=>{
							//点击保存就调用保存到相册的接口
							if (data.tapIndex == 0) {
								uni.saveImageToPhotosAlbum({
									filePath: item.dynamicImg,
									success: ()=> {
										uni.showToast({
											icon: "none",
											title: "保存成功"
										})
									},
									fail:()=> {
										uni.showToast({
											icon: "none",
											title: "保存失败"
										})
									}
								});
							}
						},
						fail: (err)=> {
							console.log(err.errMsg);
						}
					}
				});
			},
			/**
			 * 查看更多
			 * @param {Object} p
			 */
			showMore(){
				if (this.page < this.pagecount) {
					this.page++;
					this.getnewsList(this.page);
				} else{
					this.loadingText = '我是有底线的';
				}
			},
			/**
			 * 服务器拉取朋友圈数据
			 * @param {number} p 页数
			 * @param {boolean} force 是否强制从服务器获取 
			 */
			getnewsList(p, force){
				if(Number(p)){
					this.page = p;
				}
				data.find.get({
					page: this.page,
					force,
					success: (data) => {
						this.pagecount = data.pagecount;
						if (this.findsList.length == 0) {
							this.findsList = data.data;
						} else{
							this.findsList = this.findsList.concat(data.data);
						}
						if(data.data.length < 10){
							this.loadingText = '我是有底线的';
						}
					},
					fail: (code, err) => {
						console.log(code, err);
					}
				});
			},
		},
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.content {
		width: 100%;
	}
	/* 好友圈主体 */
	.finds-body {
		width: 100%;
		display: flex;
		flex-direction: column;
		border-bottom: 20upx solid @bgcolor;
	}
	/* 发布 取消按钮 */
	.btn {
		font-size: 32upx;
		width: 50%;
	}

	.btn::after {
		border: none;
	}
	
	.say{
		position: relative;
		background-color: #EEEEEE;
		margin-left: 10%;
		margin-right: 10%;
		padding-left: 2%;
		border-radius: 5px;
		width: 80%;
	}
</style>
