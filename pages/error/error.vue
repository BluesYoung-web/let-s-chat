<template>
	<view class="flex flex-direction-column flex-vc">
		<image class="width-300 height-300 mg-tp250" src="/static/img/common/err.png"  mode="aspectFit"></image>
		<text class="color-999 mg-tp30">{{msg}}</text>
	</view>
</template>

<script>
	import data from '@/data.js';
	const codeList = {
		404: '/pages/common/login'
	}
	export default {
		onLoad(e) {
			console.log(e);
			this.msg = e.err;
			this.showTips(e);
		},
		data() {
			return {
				msg: "网络错误",
			}
		},
		methods: {
			showTips(e){
				let code = e.code;
				let msg = e.err;
				let url = codeList[code];
				this.toDo(msg, url);
			},
			toDo(msg, url){
				uni.showModal({
					title:"提示",
					content: msg,
					success: (res) => {
						if(res.confirm == true){
							uni.reLaunch({
								url
							});
						}else{
							uni.reLaunch({
								url
							});
						}
					},
					showCancel: false
				});
			}
		}
	}
</script>

<style>

</style>
