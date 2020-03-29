<template>
	<view>
		<!-- 表情键盘组件 -->
		<view class="facesBox" v-show="showEmoji">
			<!-- 表情类型 -->
			<view class="facesHead" >
				<view class="type flex flex-vc flex-jc" v-for="(item,index) in emojiData" :key="index" @tap="select(item)">
					<image class="type-img" :class="item.select ? 'bg' : ''" :src="item.src"></image>
				</view>
				<!-- 删除按钮 -->
				<view class="backspace flex flex-vc flex-jc" @tap="deleteEmoji">
					<image class="backspace-img" :src="delImg" ></image>
				</view>
			</view>
			<!-- 表情内容 -->
			<view class="facesContent">
				<scroll-view scroll-y="true" style="height: 500upx;">
					<view class="emoji" v-for="(item, index) in emojiData" :key="index">
						<view v-show="item.select">
							<view class="face" v-for="(tp,id) in item.emojiList" :key="id" @tap="showFaces(tp)">
								{{showProcess(tp)}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		/**
		 * 组件名
		 */
		name:'emojiInput',
		/**
		 * 组件属性
		 */
		props:{
			showEmoji: {
				type: [Boolean, String],
				default: false
			},
			emojiData: {
				type: Array,
				default(){
					return []
				}
			},
			delImg: {
				type: String,
				default: '/static/img/backspace.png'
			}
		},
		beforeUpdate() {
			/**
			 * 遍历每一个表情
			 */
			for (let i in this.emojiData) {
				let emoji = this.emojiData[i].emojiSrc;
				this.emojiData[i].emojiList = [];
				for (let j in emoji) {
					this.emojiData[i].emojiList.push(emoji[j].char);
				}
			}
		},
		beforeMount() {
			/**
			 * 遍历每一个表情
			 */
			for (let i in this.emojiData) {
				let emoji = this.emojiData[i].emojiSrc;
				for (let j in emoji) {
					this.emojiData[i].emojiList.push(emoji[j].char);
				}
			}
		},
		methods:{
			/**
			 * 输入表情
			 */
			showFaces(item){
				this.$emit('showFaces', item);
			},
			/**
			 * 删除表情
			 */
			deleteEmoji(){
				this.$emit('deleteEmoji', 'ddddd');
			},
			/**
			 * 选择表情类型
			 */
			select(item){
				this.$emit('select', item);
			},
			/**
			 * 兼容手机
			 */
			showProcess(tp){
				return tp;
			}
		}
	}
</script>

<style>
	.facesContent{
		height: 520upx;
	}
	.emoji{
		width: 750upx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.face{
		width: 80upx;
		height: 80upx;
		text-align: center;
		line-height: 80upx;
		display: inline-block;
	}
	.backspace{
		width: 80upx;
		height: 80upx;
		float: right;
	}
	.backspace-img{
		width: 60upx;
		height: 60upx;
	}
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
	.type{
		width: 80upx;
		height: 80upx;
		float: left;
	}
	.type-img{
		width: 50upx;
		height: 50upx;
		border-radius: 50%;
	}
	.bg{
		background-color: #344955;
	}
	.facesBox{
		width: 100%;
		height: 600upx;
		background-color: #edf0f2;
		position: fixed;
		bottom: 0;
	}
	.facesHead{
		height: 80upx;
		background-color: #ffffff;
	}
	.emojiData{
		border-top:1px solid #CED2D5;
		position: absolute;
		bottom: 0;
		height: 100upx;
		width: 100%;
		display: flex;
		flex-direction: row;
	}
</style>
