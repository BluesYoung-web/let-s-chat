<template>
	<view>
		<view class="contentRow flex flex-js"  v-for="(item,index) in likesList" :key="index">
			<view class="userHead flex flex-jc flex-vc" @tap="click(item)">
				<img-cache defaultImg="/static/img/finds_01.jpg" :src="item.avatar"></img-cache>
			</view>
			<view class="commentContent flex flex-vc" @tap="click(item)">
				<view class="userName flex flex-vc">
					<text>{{item.nick}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import imgCache from '@/components/young-img-cache/young-img-cache.vue';
	export default {
		name: 'likesList',
		components:{
			imgCache
		},
		props:{
			likesList: {
				type: Array,
				default(){
					return []
				}
			}
		},
		methods:{
			click(item){
				this.$emit('clickUser', item);
			}
		}
	}
</script>

<style>
	/* flex布局属性集 */
	.flex {
		display: box; /* OLD - Android 4.4- */
		display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
		display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
		display: -ms-flexbox; /* TWEENER - IE 10 */
		display: -webkit-flex; /* NEW - Chrome */
		display: flex;

	}
	/* 垂直居中 */
	.flex-vc {
		/* 09版 */
		-webkit-box-align: center;
		/* 12版 */
		-webkit-align-items: center;
		-moz-align-items: center;
		-ms-align-items: center;
		-o-align-items: center;
		align-items: center;
	}

	.flex-jc { 
		justify-content: center;
	}
	.flex-js { 
		justify-content: flex-start;
	}
	.contentRow{
		width: 100%;
		height: 100upx;
		margin-top: 35upx;
	}
	.userHead{
		width: 100upx;
		height: 100upx;
	}
	.userHead image{
		height: 65upx;
		width: 65upx;
		border: 1upx solid #344955;
		border-radius: 50%;
	}
	.commentContent{
		padding: 0 10upx;
	} 
	.userName{
		height: 50upx;
	}
	.userName text{
		font-size: 25upx;
		color: #344955;
	}
</style>
