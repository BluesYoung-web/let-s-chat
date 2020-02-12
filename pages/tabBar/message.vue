<template>
	<!-- 消息页面  -->
	<view>
		<chat-item :dataList = "dataList" :options = "options" :options1 = "options1"
		@tap = "inToRoom()"></chat-item>
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
				options: [{
						text: '置顶',
						style: {
							backgroundColor: 'rgb(199, 198, 205)'
						}
					},{
						text: '标记为已读',
						style: {
							backgroundColor: 'rgb(254, 156, 1)'
						}
					},{
						text: '删除',
						style: {
							backgroundColor: 'rgb(255,58,49)'
						}
				}],
				options1: [{
						text: '取消置顶',
						style: {
							backgroundColor: 'rgb(199, 198, 205)'
						}
					},{
						text: '标记为已读',
						style: {
							backgroundColor: 'rgb(254, 156, 1)'
						}
					},{
						text: '删除',
						style: {
							backgroundColor: 'rgb(255,58,49)'
						}
				}]
			}
		},
		components:{
			chatItem,
		},
		methods:{
			inToRoom(e){
				console.log(e);
			}
		}
	}
</script>


<style>
	
</style>
