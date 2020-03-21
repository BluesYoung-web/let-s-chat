<template>
	<!-- 我的发表列表 -->
	<view>
		<scroll-view enable-back-to-top="true" scroll-y="true" :scroll-top="scrollTop" :style="{height:scrollHeight + 'px'}"
		 @scroll="scroll">		 	
			<!-- 一个好友圈动态 -->
			<view class="finds-body" v-for="(item,index) in findsList" :key="index">
				<find-item :item="item" @watchImg="watchImg" @like="like" @comment="comment"
				:showDel="true" @del="deleteMyRelease"></find-item>
			</view>
			<back-top src="/static/img/top.png" :scrollTop="old.scrollTop" 
			@toTopClick="goTop"></back-top>
			<edit-item type="3" :content="loadingText" @poupChange="showMore"></edit-item>
		</scroll-view>
	</view>
</template>

<script>
	import findItem from "@/components/young-find-item/young-find-item.vue";
	import editItem from "@/components/young-edit-item/young-edit-item.vue";
	import backTop from "@/components/young-back-top/young-back-top.vue";
	import data from '@/data.js';
	export default {
		components: {
			findItem,
			editItem,
			backTop
		},
		mounted() {
			//高度自适应
			this.scrollHeight = uni.getSystemInfoSync().windowHeight;
		},
		data() {
			return {
				findsList:[],
				page: 1,
				user: null,
				pagecount: null,
				//点击加载更多
				loadingText: '点击加载更多...',
				scrollHeight: '',
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
			}
		},
		onLoad(){
			data.user.get_info({
				success: (res) => {
					this.user = res;
					this.getnewsList(1);
				}
			});
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.findsList = [];
			this.loadingText = '点击加载更多...';
			// 从服务器拉取新数据
			this.getnewsList(1, true);
			// 关闭下拉刷新动画
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			/**
			 * 删除单条好友圈
			 */
			deleteMyRelease(item){
				uni.showModal({
					title: '提示',
					content: '是否要删除该条好友圈？',
					success: (res) => {
						if (res.confirm) {
							data.find.del({
								findId: item.id,
								pagecount: this.pagecount,
								success: () =>{
									uni.showToast({
										title: '好友圈删除成功'
									});
								}
							});
						} else{
							console.log('取消删除');
						}
					}
				})
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
				// this.$nextTick(() => {
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
				// });
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
				data.find.get_my_release({
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
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.finds-body {
		width: 100%;
		display: flex;
		flex-direction: column;
		border-bottom: 20upx solid @bgcolor;
	}
</style>
