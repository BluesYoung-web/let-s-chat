<template>
	<!-- 消息页面  -->
	<view>
		<chat-item :dataList = "dataList" @clickInto = "onClickInto" @clickChoice = "onClickChoice"></chat-item>
	</view>
</template>

<script>
	import chatItem from '@/components/young-chat-item/young-chat-item.vue';
	export default {
		data(){
			return {
				dataList: [{
					"imgUrl":"http://106.15.53.15:8808/data/head/15.jpg",
					"nick":"Mike",
					"ot":1581472633000,
					"isTop":0,
					"time":"09:57",
					"content":" 啦啦啦",
					"right":0,
					"msgNum":1,
					"roomId":"47",
					"conversation":[{
						"time":"09:57",
						"user":"others",
						"content":" 啦啦啦",
						"ot":1581472633000,
						"imgUrl":"http://106.15.53.15:8808/data/head/15.jpg",
						"type":0,
					}],
				}],
			}
		},
		components:{
			chatItem,
		},
		methods:{
			/**
			 * 消息置顶
			 */
			setTop(event, item){
				if(this.dataList[0].roomId == item.roomId){
					this.dataList[0].isTop = 1;
				}else{
					this.dataList.sort((a, b) => {
						// 排序、改变样式
						if(b.roomId == item.roomId){
							b.isTop = 1;
							return 1;
						}else{
							b.isTop = 0;
							return -1;
						}
					});
				}
				// // 存储到缓存
				// data.chat.set_list({
				// 	value: this.dataList,
				// 	success: () => {
				// 		console.log("缓存修改成功");
				// 		// 重新渲染
				// 		this.init();
				// 	},
				// 	fail: () => {
				// 		console.log("缓存修改失败");
				// 	}
				// });
			},
			/**
			 * 取消置顶
			 */
			clearTop(event, item){
				// 按时间排序
				this.dataList.sort((a, b) => b.ot - a.ot);
				// 改变样式
				this.dataList.map((v) => v.roomId == item.roomId ? v.isTop = 0 : v.isTop = v.isTop || 0);
				// // 存储到缓存
				// data.chat.set_list({
				// 	value: this.dataList,
				// 	success: () => {
				// 		console.log("缓存修改成功");
				// 		// 重新渲染
				// 		this.init();
				// 	},
				// 	fail: () => {
				// 		console.log("缓存修改失败");
				// 	}
				// });
			},
			/**
			 * 标记为已读
			 */
			setIKnow(item){
				this.dataList.map((v) => v.roomId == item.roomId ? v.msgNum = 0 : null);
				// // 存储到缓存
				// data.chat.clear_msg_num(item.roomId, item.content, item.ot);
			},
			/**
			 * 删除某条对话
			 */
			deleteMessage(item, index) {
				this.dataList.splice(index, 1);
				//同时减少消息tabBar右上角数字，num为零时移除
				// this.changMsgNum();
				// let roomId = item.roomId;
				// // 存储到缓存
				// data.chat.set_list({
				// 	value: this.dataList,
				// 	success: () => {
				// 		console.log("缓存修改成功");
				// 		// 重新渲染
				// 		this.init();
				// 	},
				// 	fail: () => {
				// 		console.log("缓存修改失败");
				// 	}
				// });
				
			},
			/**
			 * 直接点击对话进入某个聊天室
			 * @param {Object} item
			 */
			onClickInto(item){
				uni.navigateTo({
					url:`../messageSubpackage/conversation?id=${item.roomId}&title=${item.nick}`
				});
			},
			/**
			 * 滑动开关
			 * @param {Object} event
			 * @param {Object} item
			 * @param {Object} index
			 */
			onClickChoice(event, item, index){
				switch (event.index){
					case 0:
						console.log("消息置顶");
						if(event.content.text == "置顶"){
							this.setTop(event, item);
						}else{
							this.clearTop(event, item);
						}
						break;
					case 1:
						console.log("标记为已读");
						this.setIKnow(item);
						break;
					case 2:
						console.log("删除");
						this.deleteMessage(item, index);
						break;
				}
			}
		}
	}
</script>


<style>
	
</style>
