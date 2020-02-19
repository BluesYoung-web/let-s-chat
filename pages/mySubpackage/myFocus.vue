<template>
	<!-- 关注我的列表 -->
	<view class="focusLists">		
		<view class="focusRow flex flex-vc flex-jsb" v-for="(item,index) in lists" v-bind:key="index">
			<view class="focusHead flex flex-vc flex-jsb" @tap="toInfo(item)">
				<image :src="item.avatar" mode="aspectFill"></image>
				<text class="inline-block width-150 one-line-ellipsis">{{item.name}}</text>
			</view>
			<view class="addFocus flex flex-jc" @tap="focus(item)">
				<text v-show="item.isFocus==0">+关注</text>
				<text v-show="item.isFocus==1">已关注</text>
			</view>
		</view>			
	</view>
</template>

<script>
	import {mapMutations,mapState} from 'vuex';
	import request from '@/request/request.js';
	export default {
		data() {
			return {	
				lists:[
					// {
					// 	avatar:'../../../static/img/finds_01.jpg',
					// 	name:'房辉冯',
					//  uid:'',
					// 	isFocus:0
					// },
				]
			}
		},
		onLoad() {
			this.lists=this.followMe;
		},
		onShow(){
			// 根据state动态改变关注文字
			if (this.myFriends) {
				let myFriends=this.myFriends;
				let key=[];
				for (let i in myFriends) {
					for (let j in myFriends[i]) {
						key.push(myFriends[i][j].account);
					}
				}
				for (let i in this.lists) {
					if (key.includes(this.lists[i].uid)) {
						this.lists[i].isFocus=1;
					}else{
						this.lists[i].isFocus=0;
					}
				}
			}
		},
		computed:{
			...mapState(['followMe','myFriends'])
		},
		/*
		methods: {
			...mapMutations(['addFriend','deleteFriend']),
			toInfo(item){
				let isF=item.isFocus ? true : false;
				uni.navigateTo({
					url: `../../addressSubpackage/friendsInfo/friendsInfo?uid=${item.uid}&isF=${isF}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			focus(item){
				uni.showLoading({
					title:"加载中",
					complete: (res) => {
					}
				})
				if(item.isFocus==0){
					// 加好友
					request.addFriendByFocus(item.uid,(data)=>{
						if(data!=0){
							item.isFocus=1;
							uni.showToast({
								title:"关注成功",
								icon:"none"
							});
							let obj={
								account:item.uid,
							}
							for (let i in data) {
								obj.key=i;
								obj.name=data[i][0].name;
							}
							this.addFriend(obj);
						}else{
							uni.showToast({
								title:"关注失败",
								icon:"none"
							});
						}
					});
				}else{
					// 取关好友
					request.deleteFriendByFocus(item.uid,(data)=>{
						if(data==1){
							item.isFocus=0;
							uni.showToast({
								title:"取消关注成功",
								icon:"none"
							});
							this.deleteFriend({account:item.uid});
						}else{
							uni.showToast({
								title:"取消关注失败",
								icon:"none"
							});
						}
					});
				}
			}
		},
		*/
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.focusLists{
		
	}
	.focusRow{
		width: 100%;
		height: 200upx;
		border-bottom: 1px solid @colorD;
	}
	.focusHead{
		width: 360upx;
		height: 200upx;
	}
	.focusHead image{
		width: 100upx;
		height: 100upx;
		/* border: 1px solid #344955; */
		border-radius: 50%;
		margin-left: 50upx;
	}
	.focusHead text{
		margin-right: 50upx;
	}
	.focusUsername{
		display: inline-block;
		height: 200upx;
		line-height: 200upx;
		font-size: 30upx;
		font-weight: bold;
	}
	.addFocus{
		width: 140upx;
		margin-right: 70upx;
		/* border: 1px solid #344955; */
		border-radius: 20upx;
		background-color: @codeBorder;
		color: white;
	}
</style>
