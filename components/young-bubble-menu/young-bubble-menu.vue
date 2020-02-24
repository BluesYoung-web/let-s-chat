<template>
	<view class="mask" :class="!show?'':'mask-show'" :style="{backgroundColor:show?maskBg:'rgba(0,0,0,0)'}" @tap="tapMask">
		<view class="popups" :class="[theme]"
			:style="{top: popupsTop ,left: popupsLeft,flexDirection:direction}">
			<text :class="dynPlace" :style="{width:'0px',height:'0px'}" v-if="triangle"></text>
			<view v-for="(item,index) in popData" :key="index" @tap.stop="tapItem(item)" 
				class="itemChild view" :class="[direction=='row'?'solid-right':'solid-bottom',item.disabled?'disabledColor':'']">
				<uni-icons :color="theme == 'light' ? '#ccc' : '#fff'" :type="item.icon" size="24" :style="{fontWeight: 'bold'}" v-if="item.icon"/>
				<text>{{item.title}}</text>
				
			</view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	export default{
		/**
		 * 组件名
		 */
		name: 'bubbleMenu',
		/**
		 * 依赖的组件
		 */
		components: {
			uniIcons
		},
		/**
		 * 参数
		 */
		props:{
			/**
			 * 罩层背景色
			 */
			maskBg:{
				type:String,
				default:'rgba(0,0,0,0)'
			},
			/**
			 * 三角形的方向
			 */
			placement:{
				type:String,
				default:'default' //default top-start top-end bottom-start bottom-end 
			},
			/**
			 * 菜单排列的方向
			 */
			direction:{
				type:String,
				default:'column' //column row
			},
			/**
			 * 菜单的横向位置
			 */
			x:{
				type:[Number,String],
				default:0
			},
			/**
			 * 菜单的纵向位置
			 */
			y:{
				type:[Number,String],
				default:0
			},
			/**
			 * 是否显示
			 */
			ifShow:{
				type:[Boolean,String],
				default:false
			},
			/**
			 * 菜单项
			 */
			popData:{
				type:Array,
				default:()=>[]
			},
			/**
			 * 主题色
			 */
			theme:{
				type:String,
				default:'light' //light dark
			},
			/**
			 * 位置是否动态设置
			 */
			dynamic:{
				type:Boolean,
				default:false
			},
			/**
			 * 距离屏幕的间隙
			 */
			gap:{
				type:Number,
				default:20
			},
			/**
			 * 是否显示三角形
			 */
			triangle:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
				/**
				 * 计算后的纵向距离
				 */
				popupsTop:'0px',
				/**
				 * 计算后的横向距离
				 */
				popupsLeft:'0px',
				/**
				 * 是否显示
				 */
				show:false,
				/**
				 * 三角形的默认位置
				 */
				dynPlace:''
			}
		},
		mounted() {
			this.popupsPosition()
		},
		methods:{
			/**
			 * 关闭菜单
			 */
			tapMask(){
				this.$emit('close');
			},
			/**
			 * 点击菜单项
			 * @param {object} item 菜单项
			 */
			tapItem(item){
				if(item.disabled) return
				this.$emit('clickMenu',item)
				this.tapMask();
			},
			getStatusBar(){
				let promise = new Promise((resolve,reject)=>{
					uni.getSystemInfo({
						success: function(e) {
							
							let customBar
							// #ifdef H5
					
							customBar = e.statusBarHeight + e.windowTop;

							// #endif
							resolve(customBar)
						}
					})
				})
				return promise
			},
			async popupsPosition(){
				let statusBar = await this.getStatusBar()
				let promise = new Promise((resolve,reject)=>{
					let popupsDom = uni.createSelectorQuery().in(this).select(".popups")
					popupsDom.fields({
					    size: true,  
					}, (data) => {
						let width = data.width
						let height = data.height
						
						let y = this.dynamic?this.dynamicGetY(this.y,this.gap):this.transformRpx(this.y)
						
						let x = this.dynamic?this.dynamicGetX(this.x,this.gap):this.transformRpx(this.x)
					
						
						// #ifdef H5
						y = this.dynamic?(this.y+statusBar): this.transformRpx(this.y+statusBar)
						// #endif 
						
						this.dynPlace = this.placement=='default'?this.getPlacement(x,y):this.placement
						
						switch(this.dynPlace){
							case 'top-start':
								this.popupsTop = `${y+9}px`
								this.popupsLeft = `${x-15}px`
								break;
							case 'top-end':
								this.popupsTop = `${y+9}px`
								this.popupsLeft = `${x+15-width}px`
								break;
							case 'bottom-start':
								this.popupsTop = `${y-18-height}px`
								this.popupsLeft = `${x-15}px`
								break;
							case 'bottom-end':
								this.popupsTop = `${y-9-height}px`
								this.popupsLeft = `${x+15-width}px`
								break;
						}
						resolve()
					}).exec();
					
				})
				return promise
				
			},
			getPlacement(x,y){
				let width = uni.getSystemInfoSync().windowWidth
				let height = uni.getSystemInfoSync().windowHeight
				if(x>width/2&&y>height/2){
					return 'bottom-end'
				}else if(x<width/2&&y<height/2){
					return 'top-start'
				}else if(x>width/2&&y<height/2){
					return 'top-end'
				}else if(x<width/2&&y>height/2){
					return 'bottom-start'
				}else if(x>width/2){
					return 'top-end'
				}else{
					return 'top-start'
				}
			},
			dynamicGetY(y,gap){
				
				let height = uni.getSystemInfoSync().windowHeight
				y = y<gap?gap:y
				y = height - y <gap? (height - gap) : y
				
				return y
			},
			dynamicGetX(x,gap){
				let width = uni.getSystemInfoSync().windowWidth
				x = x< gap?gap:x
				x = width - x <gap? (width - gap) : x
				return x
			},
			transformRpx(params){
				
				return params*uni.getSystemInfoSync().screenWidth/375
			}
		},
		watch:{
			ifShow:{
				immediate:true,
				handler:async function (newVal,oldVal){
					if(newVal) await this.popupsPosition()
					this.show = newVal
				}
			},
			placement:{
				immediate:true,
				handler(newVal,oldVal){
					this.dynPlace = newVal
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mask{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9999;
		transition: background 0.3s ease-in-out;
		visibility: hidden;
		
		&.mask-show{
			
			visibility: visible;
		}
	}
	.popups{
		position: absolute;
		padding: 20rpx;
		border-radius: 5px;
		display:flex;
		.view{
			padding: 10rpx;
		}
	}
	.dark{
		background-color: #4C4C4C;
		color: #fff;
		.top-start:after {
			content: "";
			position: absolute;
			top: -18rpx;
			left: 10rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #4C4C4C;
		}
		.top-end:after {
			content: "";
			position: absolute;
			top: -18rpx;
			right: 10rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #4C4C4C;
		}
		.bottom-start:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			left: 10rpx;
			border-width: 20rpx 20rpx 0 ;
			border-style: solid;
			border-color: #4C4C4C transparent transparent ;
			
		}
		.bottom-end:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			right: 10rpx;
			border-width: 20rpx 20rpx 0 ;
			border-style: solid;
			border-color: #4C4C4C transparent transparent ;
		}
		.disabledColor{
			color: #c5c8ce;
		}
  }
	.light{
		color: #515a6e;
		box-shadow: 0upx 0upx 30upx rgba(0,0,0,0.2);
		background: #fff;
		.top-start:after {
			content: "";
			position: absolute;
			top: -18rpx;
			left: 10rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #fff;
		}
		.top-end:after {
			content: "";
			position: absolute;
			top: -18rpx;
			right: 10rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #fff;
		}
		.bottom-start:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			left: 10rpx;
			border-width: 20rpx 20rpx 0 ;
			border-style: solid;
			border-color: #fff transparent transparent ;
			
		}
		.bottom-end:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			right: 10rpx;
			border-width: 20rpx 20rpx 0 ;
			border-style: solid;
			border-color: #fff transparent transparent ;
		}
		.disabledColor{
			color: #c5c8ce;
		}
	}
	.solid-bottom{
		border-bottom: 1px solid #666;
	}
	.solid-right{
		
		border-right: 1px solid #666;
	}
	.popups .itemChild:last-child{
		border: none;
	}
	
</style>
