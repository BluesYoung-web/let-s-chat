<template>
	<!-- 我的发表列表 -->
	<view>
		<view class="release" v-for="(item,index) in findsList" :key="index">
			<view class="releaseTime flex flex-jc flex-vc" >
				<text>{{item.showTime}}</text>
			</view>
			<view class="myRelease flex flex-jc" @tap="checkImg(item)">
				<image :src="item.dynamicImg" mode="aspectFit"></image>
			</view>
			
			
			
			<view class="likes-comments">
				<!-- 点赞 -->
				<view class="likes" @tap="toLikeList(item)">
					<view class="flex flex-vc width-80 flex-jsb">
						<view class="height-50">
							<image src="/static/img/heart.png" mode=""></image>
						</view>
						<span class="inline-block width-20">{{item.likesNum}}</span>
					</view>
				</view>
				<!-- 评论 -->
				<view class="comments" @tap="toCommentList(item)">
					<view class="flex flex-vc width-80 flex-jsb">
						<view class="height-50">
							<image src="/static/img/comment.png" mode=""></image>
						</view>
						<span class="inline-block width-20">{{item.commentsNum}}</span>
					</view>
				</view>
				<!-- 删除 -->
				<view class="delete" @tap="deleteActive(item)">
					<view class="flex flex-vc width-80 flex-jsb">
						<view class="height-50">
							<image src="/static/img/delete.png" mode=""></image>
						</view>
						<!-- <span class="inline-block width-20">{{item.likesNum}}</span> -->
					</view>
				</view>
				
			</view>
			
		</view>
		<!-- 删除提示框 -->
		<uni-popup :show="isShow" type="center"  @change="change">
			<view class="popup flex flex-direction-column flex-vc">
				<text>是否确定要删除</text>
				<button type="default" style="color: white;width: 50%;" @tap="deleteMyRelease">确定</button>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	
	// 请求抽取
	import request from '@/request/request.js';
	
	import {mapState,mapMutations} from 'vuex';
	export default {
		components: {uniPopup},
		mounted() {
			// 根据时间排序
			this.findsList.sort((a,b)=>b.time-a.time);
		},
		beforeUpdate() {
			// 根据时间排序
			this.findsList.sort((a,b)=>b.time-a.time);
		},
		data() {
			return {
				findsList:[],
				isShow: false,
				sign:'',  //删除标记
			}
		},
		computed:{
			...mapState(['userInfo','myFindLists'])
		},
		onShow() {
			// 如果暂存里面有，则直接从暂存里面拿
			if(this.myFindLists){
				this.findsList=this.myFindLists;
				console.log(JSON.stringify(this.findsList));
			}else{
				//从服务器获取自己发送的动态
				request.getMyFinds(this.userInfo.account,(data)=>{
					this.findsList=data;
				});
			}
		},
		/*
		methods: {
			//弹出删除提示框
			deleteActive(item){
				this.sign = item;
				// this.deleteRelease(item)
				if(this.isShow == false){
					this.isShow = true;
				}else{
					this.isShow = false
				}
			},
			// 点击空白处关闭提示框
			change(e){
				if (!e.show){
					this.isShow = false;
				}
			},
			//删除朋友圈
			deleteMyRelease(){
				
				// 从本地删除
				let id=this.sign.id;
				for (let i in this.findsList) {
					if(this.findsList[i].id===id){
						this.findsList.splice(i,1);
					}
				}
				// 从服务器删除
				request.deleteRelease(id,(data)=>{
					if(data==1){
						uni.showToast({
							icon:"none",
							title:"删除成功"
						});
					}else{
						uni.showToast({
							icon:"none",
							title:"删除失败"
						});
					}
				});
				// 更新暂存
				for (let i in this.findLists) {
					if(this.findLists[i].id===id){
						this.findLists.splice(i,1);
					}
				}
				this.isShow = false;
			},
			// 查看图片
			checkImg(item) {
				uni.previewImage({
					urls: [item.dynamicImg]
				});
			},
			
			//跳转至点赞详情页
			toLikeList(e){
				let show = 1;
				//去除底部
				// let showBottom = false;
				uni.navigateTo({
					url: `../../findsSubpackage/comments/comments?id=${e.id}&likesNum=${e.likesNum}&show=${show}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			//跳转至评论详情页
			toCommentList(e){
				let show = 0;
				//去除底部
				// let showBottom = false;
				uni.navigateTo({
					url: `../../findsSubpackage/comments/comments?id=${e.id}&likesNum=${e.likesNum}&show=${show}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
		*/
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.release{
		width: 100%;
		border-bottom: 10px solid @colorD;
		padding: 20upx 0;
	}
	.releaseTime{
		width: 100%;
		height: 70upx;
		font-size: 30upx;
	}
	.myRelease image{
		width: 100%;
	}
	.likes-comments {
		height: 70upx;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.likes {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 33%;
		height: 100%;
	}

	.likes image {
		width: 50upx;
		height: 50upx;
	}

	.comments {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 33%;
		height: 100%;
	}

	.comments image {
		width: 50upx;
		height: 50upx;
	}
	.delete {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 33%;
		height: 100%;
	}
	
	.delete image {
		padding-top: 5upx;
		width: 45upx;
		height: 45upx;
	}
</style>
