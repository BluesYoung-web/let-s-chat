<template>
	<!-- 朋友圈界面 -->
	<view class="content">
		<scroll-view enable-back-to-top="true" scroll-y="true" :scroll-top="scrollTop" ref="myscroll"
		 @scroll="scroll">		 	
			<!-- 一个朋友圈动态 -->
			<view class="finds-body" v-for="(item,index) in findsList" :key="index">
				<find-item :item="item" @watchImg="watchImg" @like="like" @comment="comment"></find-item>
			</view>
			<edit-item type="3" :content="loadingText"></edit-item>
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
	export default {
		components: {
			uniPopup,
			findItem,
			editItem
		},
		mounted() {
			// 根据时间排序
			// this.findsList.sort((a, b) => b.time - a.time);
			console.log(this.$refs.myscroll.$el.clientHeight);
		},
		onShow() {
			console.log(uni.getSystemInfoSync().screenHeight);
			console.log(this.$refs.myscroll.$el.clientHeight);
		},
		beforeUpdate() {
			// 根据时间排序
			// this.findsList.sort((a, b) => b.time - a.time);
		},
		data() {
			return {
				page:1,
				//点击加载更多
				loadingText:'加载更多...',
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				findsList: [ //空间发表动态的列表
					{
						id:1,
						userId: 12345678,
						avatar: "/static/img/finds_01.jpg",
						name: "小美",
						time: 1576199585544,
						showTime:new Date(1576199585544).toTimeString().substr(0, 5),
						dynamicImg: "/static/img/finds_01.jpg", //发布的动态图片
						likesNum: 9, //点赞数
						commentsNum: 15, //评论数
						likeAction: 0, //是否给他点赞
					},
					{
						id:1,
						userId: 12345678,
						avatar: "/static/img/finds_01.jpg",
						name: "小美",
						time: 1576199585544,
						showTime:new Date(1576199585544).toTimeString().substr(0, 5),
						dynamicImg: "/static/img/finds_01.jpg", //发布的动态图片
						likesNum: 9, //点赞数
						commentsNum: 15, //评论数
						likeAction: 0, //是否给他点赞
					}
				],
				popup: false, //拍照面板是否显示
				color1: '', //拍照弹出框拍摄view颜色
				color2: '', //拍照弹出框相册view颜色

				toast: false, //确认发表提示框
				findsImgUrl: "/static/img/avatar.png", //发表的图片路径
			}
		},
		
		// 下拉刷新
		onPullDownRefresh() {
			// 关闭小红点的显示
			uni.removeTabBarBadge({
				index: 2
			});
			// 从服务器拉取新数据
			this.getnewsList(1);
			// 关闭下拉刷新动画
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		// 监听发表动态按钮的点击事件
		onNavigationBarButtonTap(e) {
			this.popup = true;
		},
		// 监听底部按钮点击事件
		// onTabItemTap() {
		// 	// 相当于下拉刷新
		// 	uni.startPullDownRefresh();
		// 	//调用回到顶部方法
		// 	this.goTop();
		// },
		methods: {
			//前往好友资料页面
			toFriendsInfo(uid){
				uni.navigateTo({
					url: `../../addressSubpackage/friendsInfo/friendsInfo?uid=${uid}&isF=true`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(()=> {
					this.scrollTop = 0
				});
			},
			/**
			 * 点赞
			 * @param {object} e 单条朋友圈对象
			 */
			like(e) {
				// 样式改变
				e.likeAction = (e.likeAction == 1 ? 0 : 1);
				e.likeAction ? e.likesNum++ : e.likesNum--;
				// 服务器相关操作

			},
			/**
			 * 评论
			 * @param {object} e 单条朋友圈对象
			 */
			comment(e) {
				// 跳转到评论详情页
				uni.navigateTo({
					url: `/pages/findsSubpackage/comments?id=${e.id}&likesNum=${e.likesNum}`,
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
				// this['color' + flag] = '#fff'

				// uni.chooseImage({
				// 	count: 1, //默认9
				// 	sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				// 	sourceType: [flag == 1 ? 'camera' : 'album'], //根据传入的flag判断是否从相册选择
				// 	success: (res) => {
				// 		//console.log(res.tempFilePaths);
				// 		this.findsImgUrl = res.tempFilePaths[0];
				// 		// 将图片上传到服务器
				// 		uni.uploadFile({
				// 			url: `${this.serverUrl}?op=upload&file=img`,
				// 			filePath: this.findsImgUrl,
				// 			name: "img",
				// 			success: (res) => {
				// 				this.findsImgUrl = res.data;
				// 				console.log(res.data);
				// 			}
				// 		});
				// 		this.popup = false;
				// 		this.toast = true;
				// 	},
				// 	fail: (res) => {
				// 		this.popup = false;
				// 		uni.showToast({
				// 			icon: "none",
				// 			title: "取消或设备请求超时"
				// 		});
				// 	}
				// });
			},

			// 确认发表
			submitFinds() {
				// this.toast = false;
				// uni.showLoading({
				// 	title: "发布中"
				// });
				// let put = {
				// 	userId: this.userInfo.account,
				// 	// 获取当前时间戳
				// 	time: (new Date()).valueOf(),
				// 	dynamicImg: this.findsImgUrl, //发布的动态图片
				// 	// 仅为了本地暂存
				// 	name: this.userInfo.name,
				// 	avatar: this.userInfo.avatarUrl,
				// 	showTime: "刚刚",
				// 	likesNum: 0, //点赞数
				// 	commentsNum: 0, //评论数
				// 	likeAction: 0, //是否给他点赞
				// };
				// this.findsList.unshift(put);
				// // 好友圈上传数据库
				// request.putUpFinds(put, (data) => {
				// 	// 隐藏加载动画
				// 	uni.hideLoading();
				// 	uni.showToast({
				// 		icon: "none",
				// 		title: "发表成功"
				// 	});
				// 	// 好友圈添加暂存
				// 	this.addFinds(this.findsList);
				// });
				// // 发表之后自动刷新
				// uni.startPullDownRefresh();
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
		
			//服务器拉取朋友圈数据
			getnewsList(p){
				// if(Number(p)){
				// 	this.page=p;
				// }
				// uni.showNavigationBarLoading();
				// request.getLatestFinds(this.page,(data) => {
				// 	if (data) {
				// 		this.page++;
				// 		let sum=data.pop();
				// 		for (let i in data) {
				// 			this.findsList.push(data[i]);
				// 		}
				// 		// 好友圈添加暂存
				// 		this.addFinds(this.findsList);
				// 		if(this.page > sum){
				// 			this.loadingText = '已经到底啦';
				// 		}else{
				// 			this.loadingText = '点击加载更多';
				// 		}
				// 		uni.hideNavigationBarLoading();
				// 		uni.stopPullDownRefresh();
				// 	}
				// });
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
</style>
