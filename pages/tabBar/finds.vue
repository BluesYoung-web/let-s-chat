<template>
	<view>
		<view class="" v-for="(item, index) in findsList" :key="index">
			<icon-list @click="toGo(item)" class="mg-tp20" 
			:iconType="item.iconType" :iconUrl="item.iconUrl" :title="item.title"
			:showRed="item.hasNewCircle"></icon-list>
		</view>
	</view>
</template>
<script>
	import iconList from '@/components/young-icon-list/young-icon-list.vue';
	export default {
		components:{
			iconList
		},
		data(){
			return {
				findsList: [{
					iconType: 'pengyouquan',
					title: '好友圈'
				},{
					iconUrl: '/static/img/xinguan.png',
					title: '新冠肺炎疫情'
				}],
				hasNewCircle: false,
				xinguan: 'https://ncov.dxy.cn/ncovh5/view/pneumonia?share=0&source=xiaomi'
			}
		},
		onShow(){
			uni.$once('hasNewCircle', () => {
				this.findsList[0].hasNewCircle = true;
			});
		},
		methods:{
			toGo(item){
				switch (item.title){
					case '好友圈':
						uni.hideTabBarRedDot({
							index: 2
						});
						this.findsList[0].hasNewCircle = false;
						this.toCircle();
						break;
					case '新冠肺炎疫情':
						this.toXinguan();
					default:
						break;
				}
			},
			toCircle(){
				uni.navigateTo({
					url:'/pages/findsSubpackage/circle'
				});
			},
			toXinguan(){
				// #ifdef APP-PLUS
				plus.runtime.openURL(this.xinguan);
				// #endif
				// #ifdef H5
				window.open(this.xinguan);
				// #endif
				// #ifdef MP
				uni.setClipboardData({
					data: this.xinguan
				});
				uni.showModal({
					content: '本网址无法直接在小程序内打开。已自动复制网址，请在手机浏览器里粘贴该网址',
					showCancel: false
				});
				// #endif
			}
		}
	}
</script>
<style lang="less">
	@import '~@/common/common.less';
	
</style>