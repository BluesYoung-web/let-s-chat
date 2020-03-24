<template>
	<!-- 朋友圈评论列表 -->
	<view class="ct">
		<!-- 评论点赞头部 -->
		<view class="commentsTop">
			<view class="left" @tap="showComments">
				<text :style="show == 0 ? 'border-bottom:5upx solid #f9aa33;':''">
					评论 {{commentsList.length}}
				</text>
			</view>
			<view class="right" @tap="showLikes">
				<text :style="show == 1 ? 'border-bottom:5upx solid #f9aa33;':''">
					赞 {{likesList.length}}
				</text>
			</view>
		</view>
		<view class="commentsList">
			<!-- 点赞、评论列表 -->
			<scroll-view :style="{height:scrollHeight + 'px'}" scroll-y="true" class="commentsContent">
				<view v-if="show == 0">
					<!-- 评论列表 -->
					<comments-list :commentsList="commentsList" @clickUser="toUserInfo" @feedBack="feedBack"></comments-list>
				</view>
				<view v-else>
					<!-- 点赞列表 -->
					<likes-list :likesList="likesList" @clickUser="toUserInfo"></likes-list>
				</view>
			</scroll-view>
		</view>
		<!-- 评论点赞底部 -->
		<view v-show="showButtom" class="commentsBottom bg-344955 width-full">
			<view class="btn width-full height-100" @tap="toWriteComment">
				<button class="bg-849aa5 color-fff commentsButton">发表评论</button>
			</view>
		</view>
	</view>
</template>

<script>
	import likesList from '@/components/young-likes-list/young-likes-list.vue';
	import commentsList from '@/components/young-comments-list/young-comments-list.vue';
	import data from '@/data.js';
	export default {
		components:{
			likesList,
			commentsList
		},
		mounted() {
			//拿取屏幕高度
			this.scrollHeight = uni.getSystemInfoSync().windowHeight;
			let info2 = uni.createSelectorQuery().select(".commentsTop");
			info2.boundingClientRect((data)=>{
				this.scrollHeight =this.scrollHeight - data.height;//屏幕高度-底部键盘区高度
			}).exec();
			let info = uni.createSelectorQuery().select(".commentsBottom");
				info.boundingClientRect((data)=>{
					this.scrollHeight =this.scrollHeight - data.height - 5;//屏幕高度-底部键盘区高度
			}).exec();
		},
		data() {
			return {
				showButtom:true, //是否显示底部，从myRelease页面跳转过来不显示
				scrollHeight:'',
				// 评论列表
				id:null,
				show: 0, //评论列表与点赞列表切换
				// 评论列表
				commentsList:[],
				// 点赞列表
				likesList:[]
			}
		},
		methods: {
			// 显示评论列表
			showComments(){
				this.show = 0;
			},
			//显示点赞列表
			showLikes(){
				this.show = 1;
			},
			//前往写评论页面
			toWriteComment(){
				uni.navigateTo({
					url: `writeComment?findId=${this.id}`,
				});
			},
			toUserInfo(item){
				let uid = item.uid;
				data.user.get_info({
					success: (res) => {
						if (res.uid == uid) {
							uni.switchTab({
								url: '/pages/tabBar/my'
							});
						} else {
							uni.navigateTo({
								url: `/pages/addressSubpackage/friendsInfo?uid=${uid}`
							});
						}
					}
				});
			},
			feedBack(item){
				uni.navigateTo({
					url: `writeComment?findId=${this.id}&toUserId=${item.uid}`,
				});
			}
		},
		onLoad(e) {
			this.id=e.id;
			// console.log(e.show);
			//我的发表页面跳转过来显示赞列表或者评论列表
			// if(e.show ==1){
			// 	this.show=1;
			// 	this.showButtom = false;
			// }else if(e.show ==0){
			// 	this.show = 0
			// 	this.showButtom = false;
			// }
		},
		onShow() {
			this.likesList = [];
			this.commentsList = [];
			// 根据id从服务器获取对应的评论及点赞列表
			data.find.get_likes({
				findId: this.id,
				success: (res) => {
					for (const iterator of res) {
						data.friend.get_info({
							uid: iterator,
							success: (dt) => {
								this.likesList.push(dt);
							}
						});
					}
				},
				fail: (code, err) => {
					console.log(code, err);
				}
			});
			data.find.get_comments({
				findId: this.id,
				success: (res) => {
					for (const iterator of res) {
						if (iterator.toNick) {
							data.friend.get_info({
								uid: iterator.toNick,
								success: (dt) => {
									iterator.toNick = dt.nick;
									this.commentsList.push(iterator);
								}
							});
						} else {
							this.commentsList.push(iterator);
						}
					}
				},
				fail: (code, err) => {
					console.log(code, err);
				}
			});
		},
	}
</script>

<style>
	.bg-344955{
		background-color: #344955;
	}
	.bg-849aa5{
		background-color: #849aa5;
	}
	.color-fff{
		color: #ffffff;
	}
	.height-100{
		height: 100upx;
	}
	.width-full{
		width: 100%;
	}
	.ct{
		position: relative;
	}
	.btn{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.commentsBottom{
		position: fixed;
		z-index: 1;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 110upx;
	}
	.commentsButton{
		width: 600upx !important;
		font-size: 32upx !important;
	}
	.commentsTop{
		position: absolute;
		z-index: 1;
		top: 0upx;
		height: 70upx;
		width: 100%;
		font-size: 32upx;
		font-weight: bold;
		color: #344955;
		padding: 0upx 50upx;
		display: flex;
		justify-content: space-between;
	}
	.left, .right{
		height: 100%;
		display: flex;
		align-items: flex-end;
	}
	.commentsContent{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 70upx;
	}
</style>
