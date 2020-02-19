<template>
	<!-- 登陆页面 -->
	<view class="relative" :style="fullHeight">
		<!-- 商标logo -->
		<view class="logo width-full flex flex-jc">
			<image src="/static/img/logo.png" mode=""></image>
		</view>
		<!-- 登录的内容 -->
		<form @submit="loginCheck">
			<view v-show="showInput" class="loginContentView flex flex-ac flex-direction-column">
				<!-- 手机号输入框 -->
				<input name="phone" placeholder-class="color-ccc" type="number" class="phoneInput flex" maxlength="11" v-model="user.tel"
				 value="" placeholder="请输入手机号" />
				<!-- 验证码输入框 -->
				<view class="width-600 height-100  mg-tp20  flex flex-jsb">
					<input name="code" placeholder-class="color-ccc" maxlength="6" class="passwordInput" type="number" placeholder="请输入验证码" v-model="code"/>
					<!-- 获取验证码 -->
					<button class="identifying-code ft-28 color-f9aa33" :disabled="isClick" @click="getIdentifyingCode">{{time}}</button>
				</view>

				<!-- 登录按钮 -->
				<button class="loginBtn bg-344955 color-fff" form-type="submit">登录</button>
				<!-- 微信登录 -->
				<view class="register flex flex-jsb mg-tp10 color-344955 ft-32">
					<text class="wx-green" @tap="wxlogin()">微信登陆</text>
				</view>
			</view>
		</form>
		
		<!-- 底部文字 -->
		<view class="bottomTip ft-32 width-full flex flex-hc absolute">
			<text class="color-999">登录即代表阅读并同意</text>
			<text class="text-decoration-none color-f9aa33" @click="showPopup">《服务协议》</text>
		</view>

		<!-- 用户协议的弹出层 -->
		<uni-popup :show="popup" type="center" @change="popupChange">
			<view class="relative" style=" height: 1200upx;">
				<scroll-view scroll-y="true" style="height: 90%;">
					<image style="height: 1500upx;" src="/static/img/agreement.jpg" mode="scaleToFill"></image>
				</scroll-view>
				<view class="text-center mg-tp20">
					<uni-icons type="clear" color="#fff" size="30" @click="closePopup()" />
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import data from '@/data.js';
	import tools from '@/core/tools.js';
	export default {
		components: {
			uniPopup,
			uniIcons
		},
		data() {
			return {
				showInput: true, //是否显示输入框
				popup: false, //是否弹出协议面板
				isClick: false, //获取验证码按钮是否可用
				time: "获取验证码", //获取验证码或倒计时
				currtime: 60, //倒计时
				fullHeight: "", //用来获取手机屏幕大小便于底部协议底部绝对布局
				code:'',
				user:{}
			}
		},
		// 挂载时动态获取手机的屏幕大小然后赋值给根元素实现动态布局
		mounted() {
			uni.getSystemInfo({
				success: (res) =>{
					this.fullHeight = "height:" + res.windowHeight + "px";
				}
			});
		},
		methods: {
			login(){
				data.user.login({
					user: this.user,
					success: (res) => {
						console.log(res);
						uni.showToast({
							icon: "none",
							title: "登陆成功"
						});
						uni.reLaunch({
							url: "/pages/tabBar/message"
						});
					},
					fail: (code, err) => {
						console.log(code, err);
						if(err.msg == 'not bind tel'){
							uni.showModal({
								showCancel: false,
								title: "未绑定手机号",
								content: "请绑定手机号之后再使用!!!",
								success: (res) => {
									if(res.confirm){
										uni.reLaunch({
											url: `/pages/mySubpackage/setting/bindPhone?wxid=${this.user.wxid}`
										});
									}
								}
							});
						}
						uni.showToast({
							icon: "none",
							title: "登陆失败",
						});
					}
				});
			},
			// 微信登录
			wxlogin() {
				// #ifdef H5
				this.toMain({
					openId: '111',
					// openId:'oRrdQt0VnoxDYW9K8HdI9Cuoklyw'
				});
				return;
				// #endif
				let config={
					provider: 'weixin',
					success: (res) => {
						uni.getUserInfo({
							provider: 'weixin',
							success: (infoRes) => {
								/**
								 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
								 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
								 */
								this.toMain(infoRes.userInfo);
							}
						});
					},
					fail: (err) => {
						console.error('授权登录失败：' + JSON.stringify(err));
					}
				}
				
				uni.login(config);
			},
			toMain(userInfo) {
				console.log(userInfo);
				// 向服务器查询此微信是否已经绑定手机号
				this.user.wxid = userInfo.openId;
				this.login();
			},
			//获取验证码
			getIdentifyingCode() {
				if(tools.phoneCheck(this.user.tel)){
					uni.showLoading({
						title: '加载中'
					});
					setTimeout(()=>{
						uni.hideLoading();
						// 获取验证码倒计时
						this.time = this.currtime + 's';
						this.isClick = true;
						let interval = setInterval(()=>{
							this.time = --this.currtime + 's';
							if (this.currtime <= 0) {
								clearInterval(interval);
								this.time = "重新获取";
								this.currtime = 60;
								this.isClick = false;
							}
						}, 1000)
						uni.showToast({
							icon: 'none',
							title: "获取验证码成功"
						});
					}, 1000);
				}else{
					uni.showToast({
						icon: 'none',
						title: '请输入有效手机号！',
					});
				}
			},

			// 登陆验证
			loginCheck(e) {
				if(tools.phoneCheck(this.user.tel)){
					if (this.code.length != 6) {
						uni.showToast({
							icon: "none",
							title: "请输入六位数的验证码"
						});
					} else {
						// 从服务器验证用户是否存在，存在则登录
						this.login();
					}
				}else{
					uni.showToast({
						icon: 'none',
						title: '请输入有效手机号！',
					});
				}
			},

			//---------------------------弹出层------------------------
			// 展示服务协议面板
			showPopup() {
				this.popup = true;
				setTimeout(() => {
					this.showInput = false;
				}, 200);
			},
			//配合点击空白处关闭面板的函数
			popupChange(e) {
				if (!e.show) {
					this.popup = false;

					// 防止手机端输入框的placeholder层将popup弹出层覆盖,在弹出层显示时就将输入框整体的view隐藏
					setTimeout(() => {
						this.showInput = true;
					}, 50);
				}
			},
			// 点击关闭弹出层
			closePopup(e) {
				this.popup = false;
				setTimeout(() => {
					this.showInput = true;
				}, 100);
			},
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	/* 注册view */
	.register {
		width: 600upx;
		height: 100upx;
	}
	/* 底部协议提示 */
	.bottomTip {
		bottom: 60upx;
	}
	/* 微信登录的绿色 */
	.wx-green{
		color: #1BB723;
	}
</style>
