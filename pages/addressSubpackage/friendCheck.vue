<template>
	<view>
		<edit-item type="4" :checkList="checkList"
		@yes="clickYes" @no="clickNo"></edit-item>
	</view>
</template>

<script>
	import editItem from '@/components/young-edit-item/young-edit-item.vue';
	import data from '@/data.js';
	export default {
		components:{
			editItem
		},
		onShow() {
			data.friend.get_check_list({
				success: (res) => {
					for (let item of res) {
						data.friend.get_info({
							uid: item.uid,
							success: (dt) => {
								item.nick = dt.nick;
								item.avatar = dt.avatar;
								this.checkList.unshift(item);
							}
						});
					}
				},
				fail: (code, err) => {
					console.log(code, err);
				}
			});
		},
		data() {
			return {
				checkList: [],
			}
		},
		methods: {
			clickYes(item){
				data.friend.check({
					isAgree: 1,
					id: item.id,
					uid: item.uid,
					success: () => {
						this.checkList.forEach((v, i) => {
							if(v.id == item.id){
								v.isChecked = 1;
								v.isAgree = 1;
							}
						});
					},
					fail: (code, err) => {
						console.log(code, err);
					}
				});
			},
			clickNo(item){
				data.friend.check({
					isAgree: 0,
					id: item.id,
					uid: item.uid,
					success: () => {
						this.checkList.forEach((v, i) => {
							if(v.id == item.id){
								v.isChecked = 1;
								v.isAgree = 0;
							}
						});
					},
					fail: (code, err) => {
						console.log(code, err);
					}
				});
			}
		}
	}
</script>

<style>

</style>