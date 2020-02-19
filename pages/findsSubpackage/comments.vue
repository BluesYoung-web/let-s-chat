<template>
	<!-- 朋友圈评论列表 -->
	<view>
		<!-- 评论点赞头部 -->
		<view class="commentsTop">
			<view class="left" @tap="showComments"><text  :style="show===0 ? 'border-bottom:2upx solid #f9aa33;':''">评论 {{comments}}</text></view>
			<view class="right" @tap="showLikes"><text  :style="show===1 ? 'border-bottom:2upx solid #f9aa33;':''">赞 {{likes}}</text></view>
		</view>
		<view class="commentsList">
			
			<!-- 评论列表 -->
			<scroll-view :style="{height:scrollHeight + 'px'}" scroll-y="true" class="commentsContent"  v-show="show===0" >
				<view class="contentRow flex flex-js"  v-for="(item,index) in lists" v-bind:key="index"     >
					<view class="userHead flex flex-je" >
						<image :src="item.avatar" mode=""></image>
					</view>
					<view class="commentContent">
						<view class="userName flex flex-js">
							<text>{{item.name}}</text>
						</view>						
						<view class="comment">
							<text>{{item.content}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 点赞列表 -->
			<scroll-view :style="{height:scrollHeight + 'px'}" scroll-y="true" class="commentsContent" v-show="show===1">
				<view class="contentRow flex flex-js"  v-for="(item,index) in likeLists" v-bind:key="index">
					<view class="userHead flex flex-jc flex-vc" >
						<image :src="item.avatar" mode=""></image>
					</view>
					<view class="commentContent flex flex-vc">
						<view class="userName flex flex-vc">
							<text>{{item.name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			
		</view>
		<!-- 评论点赞底部 -->
		<view v-show="showButtom" class="commentsBottom bg-344955 width-full">
			<view class="btn width-full height-100" @tap="toWriteComment">
				<button class="bg-849aa5 color-fff">评论</button>
			</view>
			<view class="btn width-full height-100" @tap="showLikes()">
				<button class="bg-f9aa33 color-fff">赞</button>
			</view>
		</view>
	</view>
</template>

<script>
	// 请求抽取
	import request from '@/request/request.js';
	// 状态管理
	import {mapState,mapMutations} from 'vuex';
	
	export default {
		mounted() {
			//拿取屏幕高度
			this.scrollHeight = this.windowHeight;
			let info2 = uni.createSelectorQuery().select(".commentsTop");
			info2.boundingClientRect((data)=>{
				this.scrollHeight =this.scrollHeight - data.height;//屏幕高度-底部键盘区高度
			}).exec();
			let info = uni.createSelectorQuery().select(".commentsBottom");
				info.boundingClientRect((data)=>{
					this.scrollHeight =this.scrollHeight - data.height;//屏幕高度-底部键盘区高度
			}).exec();
		},
		computed:{
			...mapState(['windowHeight'])
		},
		data() {
			return {
				showButtom:true, //是否显示底部，从myRelease页面跳转过来不显示
				scrollHeight:'',
				// 评论列表
				id:null,
				comments:0,
				likes:0,
				show:0, //评论列表与点赞列表切换
				likeAction: false,
				// 评论列表
				lists:[
					// {
					// 	userImg:'/static/img/finds_01.jpg',
					// 	username:"用户昵称",
					// 	content:"评论内容评论内容",
					// },
				],
				// 点赞列表
				likeLists:[
					// {
					// 	userImg:'/static/img/finds_01.jpg',
					// 	username:"用户昵称",
					// },
				]
			}
		},
		methods: {
			...mapMutations(['updateFinds']),
			// 显示评论列表
			showComments(){
				if(this.show==1){
					this.show=0;
				}
			},
			//显示点赞列表
			showLikes(){
				// console.log('bbb')
				if(this.show==0){
					this.show=1;
					
				}else if(this.show==1){
					this.show=0;
				}
			},
			//前往写评论页面
			toWriteComment(){
				uni.navigateTo({
					url: `writeComment/writeComment?id=${this.id}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}			
		},
		onLoad(e) {
			this.id=e.id;
			this.likes=e.likesNum;
			console.log(e.show);
			//我的发表页面跳转过来显示赞列表或者评论列表
			if(e.show ==1){
				this.show=1;
				this.showButtom = false;
			}else if(e.show ==0){
				this.show = 0
				this.showButtom = false;
			}
		},
		onShow() {
			// 根据id从服务器获取对应的评论
			request.getComments(this.id,(data)=>{
				this.lists=JSON.parse(JSON.stringify(data));
				this.comments=this.lists.length;
			});
			// 从服务器获取点赞人的信息
			request.getLikeLists(this.id,(data)=>{
				this.likeLists=JSON.parse(JSON.stringify(data));
			});
		},
		onBackPress() {
			let obj={
				id:this.id,
				commentsNum:this.comments,
				likesNum:this.likes,
				};
			this.updateFinds(obj);
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.commentsTop{
		position: fixed;
		z-index: 1;
		top: 0;
		height: 70upx;
		width: 100%;
		font-size: 30upx;
		color: @codeBorder;
		padding: 0 25upx;
		display: flex;
		justify-content: space-between;
	}
	.commentsTop .left{
		height: 100%;
		display: flex;
		align-items: flex-end;
	}
	.commentsTop .right{
		height: 100%;
		display: flex;
		align-items: flex-end;
	}
	.contentRow{
		width: 100%;
		margin-top: 35upx;
	}
	.userHead{
		width: 100upx;
		height: 100upx;
	}
	.userHead image{
		height: 65upx;
		width: 65upx;
		border: 1upx solid @codeBorder;
		border-radius: 50%;
	}
	.commentsContent{
		position: absolute;
		width: 100%;
		height: 1010upx;
		top: 70upx;
	}
	.commentContent{
		padding: 0 10upx;
	} 
	.userName{
		height: 50upx;
	}
	.comment{
		width: 600upx;
		padding: 20upx;
		background-color: @bgcolor;
		font-size: 25upx;
	}
	.userName text{
		font-size: 25upx;
		color: @codeBorder;
	}
</style>
