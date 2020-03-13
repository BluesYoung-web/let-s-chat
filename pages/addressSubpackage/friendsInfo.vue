<template>
	<view>
		<!-- 自定义导航栏 -->
		<uni-nav-bar left-icon="back" :right-icon="isF == 1 ? 'trash' : ''" rc="#ff2c2c"
		background-color="#344955" color="#fff" @clickLeft="back" @clickRight="del"></uni-nav-bar>
		<!-- 好友资料页面 -->
		<view class="content">
			<!-- 个人信息页组件 -->
			<person-info :user="user" :buttonText="isFocus == 1 ? '取消关注' : '关注'" 
			:commendNum="myCommend" :focusNum="myFocus" :releaseNum="myRelease" 
			@toMyCommend="goTo" @toMyFocus="goTo" @toMyRelease="goTo"
			@clickButton="clickButton" @checkImg="checkImg" ></person-info>
			<!-- 加好友与发消息 -->
			<view class="friendsInfoBottom bg-344955 width-full" v-if="isF">
				<view class="btn width-full height-100" @tap="toConversation(0)">
					<button class="bg-849aa5 color-fff">发语音消息</button>
				</view>
				<view class="btn width-full height-100" @tap="toConversation(1)">
					<button class="bg-f9aa33 color-fff">发消息</button>
				</view>						
			</view>
			<view class="friendsInfoBottom bg-344955 width-full" v-else>
				<view class="btn width-full addFrends height-100" @tap="add">
					<button class="bg-f9aa33 color-fff">加为好友</button>
				</view>						
			</view>
		</view>
	</view>
</template>

<script>
	import personInfo from "@/components/young-person-info/young-person-info.vue";
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import data from '@/data.js';
	export default {
		/**
		 * 组件
		 */
		components:{
			personInfo,
			uniNavBar
		},
		data() {
			return{
				/**
				 * 用户信息
				 */
				user:{},
				myCommend:0,
				myFocus:0,
				myRelease:0,
				/**
				 * 是否是好友
				 */
				isF: 0,
				/**
				 * 是否已关注
				 */
				isFocus: 0
			}
		},
		onLoad(e) {
			this.user.uid = e.uid;
			if(e.isF){
				this.isF = e.isF;
				this.isFocus = e.isFocus;
			}
		},
		onShow() {
			data.friend.get_info({
				uid: this.user.uid,
				force: true,
				success: (dt) => {
					this.user = dt;
					if(this.isF != 1){
						this.isF = dt.isF;
					}
					if(this.isFocus != 1){
						this.isFocus = dt.isFocus;
					}
				},
				fail: (code, err) => {
					console.log(code, err);
				}
			})
			//动态获取用户的发表的，关注该用户的，该用户赞过的数量
						
		},
		methods:{
			/**
			 * 查看头像
			 */
			checkImg(){
				uni.previewImage({
					urls: [this.user.avatar]
				});
			},
			/**
			 * 点击关注、取消关注
			 */
			clickButton(){
				if(this.isFocus == 1){
					// 取关，服务器操作
					this.isFocus = 0;
				}else{
					// 关注，服务器操作
					this.isFocus = 1;
				}
			},
			/**
			 * 跳转用户的发表的，关注该用户的，该用户赞过的
			 */
			goTo(){
				uni.showToast({
					title:"不好意思，只能查看自己的哦",
					icon:"none"
				});
			},
			/**
			 * 点击左上角返回
			 */
			back(){
				uni.navigateBack();
			},
			/**
			 * 删好友
			 */
			del(){
				uni.showModal({
					title: '提示',
					content: '确认删除该好友',
					success: (res) => {
						if (res.confirm) {
							data.friend.del({
								fid: this.user.uid, 
								success: () => {
									this.isF = 0;
									this.isFocus = 0;
									uni.showToast({
										title: "好友删除成功"
									});
								},
								fail: (code, err) => {
									console.log(code, err);
								}
							});
						} else{
							console.log('1');
						}
					}
				});
			},
			/**
			 * 加好友
			 */
			add(){
				data.friend.add({
					fid: this.user.uid,
					success: () => {
						this.isF = 1;
						this.isFocus = 1;
						uni.showToast({
							title: '好友添加成功'
						});
					},	
					fail: (code, err) => {
						console.log(code, err);
					}
				})
			},
			/**
			 * 跳转到对话页
			 */
			toConversation(e){
				let voiceActive = e;
				uni.navigateTo({
					url: `/pages/messageSubpackage/conversation?voiceActive=${voiceActive}&name=${this.user.nick}&f_uid=${this.user.uid}`,
				});
			},
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	.bg-f9aa33{
		background-color: @sendMsgBtn;
	}
	.bg-849aa5{
		background-color: @borderColor;
	}
	.btn{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.friendsInfoBottom{
		position: fixed;
		z-index: 1;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 110upx;
	}
	.friendsInfoBottom button{
		width: 325upx;
		height: 70upx;
		line-height: 70upx;
		font-size: 30upx;
	}
	.addFrends button{
		width: 650upx !important;
		height: 70upx;
		line-height: 70upx;
		font-size: 30upx;
	}
</style>