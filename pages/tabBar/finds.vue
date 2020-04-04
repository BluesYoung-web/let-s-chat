<template>
	<view>
		<view class="" v-for="(item, index) in findsList" :key="index">
			<icon-list @click="toGo(item)" class="mg-tp20" 
			:iconType="item.iconType" :iconUrl="item.iconUrl" :title="item.title"
			:showRed="hasNewCircle"></icon-list>
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
				}],
				hasNewCircle: false
			}
		},
		onShow(){
			uni.$once('hasNewCircle', () => {
				this.hasNewCircle = true;
			});
		},
		methods:{
			toGo(item){
				switch (item.title){
					case '好友圈':
						uni.hideTabBarRedDot({
							index: 2
						});
						this.hasNewCircle = false;
						this.toCircle();
						break;
					default:
						break;
				}
			},
			toCircle(){
				uni.navigateTo({
					url:'/pages/findsSubpackage/circle'
				});
			}
		}
	}
</script>
<style lang="less">
	@import '~@/common/common.less';
	
</style>