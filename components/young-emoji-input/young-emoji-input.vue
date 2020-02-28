<template>
	<view>
		<view class="facesBox width-full" :style="{height: emojiHeight+'px'}" v-show="showEmoji">
			<view class="height-500">
				<scroll-view scroll-y="true" class="height-600">
					<view class="width-750 flex flex-direction-row wrap" v-for="(item, index) in emojiData" :key="index+'l0'">
						<view v-if="item.select">
							<view class="inline-block mg-lt15" v-for="(it,id) in item.emojiList" :key="id+'l2'" @tap="showFaces(it)">{{it}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="emojiData">
				<scroll-view scroll-x="true" class="width-640">
					<view class="height-100 flex flex-direction-row flex-vc">
						<view class="width-60 height-60 mg-lt30" v-for="(item,index) in emojiData" :key="index">
							<image @tap="select(item)" class="width-60 height-60" v-if="!item.select" :src="item.src" mode=""></image>
							<image class="width-60 height-60" v-else :src="item.activeSrc" mode=""></image>
						</view>
					</view>
				</scroll-view>
				<view class="height-100 flex flex-vc">
					<image @tap="deleteEmoji" src="/static/img/emoji/backspace.png" class="width-64 height-64" mode=""></image>
				</view>
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
			emojiHeight: {
				type: [Number, String],
				default: 0
			},
			showEmoji: {
				type: [Boolean, String],
				default: false
			},
			emojiData: {
				type: Array,
				default(){
					return []
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
				this.$emit('deleteEmoji');
			},
			/**
			 * 选择表情类型
			 */
			select(item){
				this.$emit('select', item);
			}
		}
	}
</script>

<style lang="less">
	/* 公共样式 */
	@import '~@/common/common.less';
	/* ------表情键盘------ */
	.facesBox{
		position: fixed;
		bottom: 0;
		background-color: #EBEFF2;
		
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
