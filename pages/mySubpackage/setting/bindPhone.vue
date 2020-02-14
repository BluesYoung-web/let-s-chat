<template>
	<view>
		<view class="">
			<text class="pre-86">+86</text>
			<input class="width-750 height-100 bg-fff pd-lt100" 
			v-model="user.phone" type="number" maxlength="11"
			placeholder-class="color-ccc" placeholder="请填写手机号"/>
		</view>
	</view>
</template>

<script>
	// 存储用户信息
	import {mapState,mapMutations} from 'vuex';
	// 缓存管理
	import service from '@/service.js';
	// 请求抽离
	import request from '@/request/request.js';
	// 常用工具函数抽离
	import tools from '@/tools/tools.js';
	export default {
		data() {
			return {
				user:{
					name:"", //昵称
					motto:"",//签名 
					account:'',//账号 
					phone:'', //手机号
					avatarUrl:"",//头像地址 /static/img/avatar.png
					wxId:"" //微信id
				}
			}
		},
		onShow() {
			// 如果存在则获取数据
			if (this.userInfo) {
				this.user=this.userInfo;
			}
		},
		// 监听下一步按钮的点击事件
		onNavigationBarButtonTap(e){
			this.phoneChange();
		},
		methods: {
			// 存储用户信息的方法
			...mapMutations(['setInfo']),
			// 确认修改手机号
			phoneChange(){
				tools.phoneCheck(this.user.phone,()=>{
					uni.showLoading({
						title: '加载中',
						mask:true,
					});
					// 信息修改完毕，提交给服务器存入数据库
					request.bindPhone((data)=>{
						if(data==1){
							uni.showToast({
								icon: 'none',
								title: '手机号绑定成功！',
							});
							uni.navigateTo({
								url:`bindSuccessful?phone=${this.user.phone}`
							});
							// 将存入数据库的信息存入到state和缓存
							this.setInfo(this.user);
							service.addUser(this.user);
						}else{
							uni.showToast({
								icon: 'none',
								title: '手机号绑定失败,该手机号已经被绑定！',
							})
						}
					},(err)=>{},(complete)=>{
						uni.hideLoading();
					});
				},()=>{
					uni.showToast({
						icon: 'none',
						title: '请输入有效手机号！',
					});
				});
				// 返回我的页面
				uni.reLaunch({
					url:"/pages/tabBar/my/my"
				});
			}
		},
		computed:{
			...mapState(['userInfo','serverUrl'])
		}
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
	page{
		background-color: @bgcolor;
	}
</style>
