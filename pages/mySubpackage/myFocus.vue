<template>
	<!-- 我关注的人 -->
	<view>		
		<edit-item type="5" :fansList="lists" @focus="focus" @disFocus="disFocus"
		@clickUser="toPeopInfo"></edit-item>	
	</view>
</template>

<script>
	import data from '@/data.js';
	import editItem from '@/components/young-edit-item/young-edit-item.vue';
	export default {
		components:{
			editItem
		},
		data() {
			return {	
				lists:[]
			}
		},
		onShow(){
			this.lists = [];
			data.user.get_info({
				success: (res) => {
					data.friend.get_focus_list({
						uid: res.uid,
						success: (tp) => {
							for (let item of tp) {
								data.friend.get_info({
									uid: item,
									force: true,
									success: (dt) => {
										this.lists.push(dt);
									},
									fail: (code, err) => {
										console.log(code, err);
									}
								});
							}
						},
						fail: (code, err) => {
							console.log(code, err);
						}
					});
				}
			});
		},
		methods: {
			/**
			 * 跳转用户信息页
			 */
			toPeopInfo(uid) {
				uni.navigateTo({
					url: `/pages/addressSubpackage/friendsInfo?uid=${uid}`,
				});
			},
			/**
			 * 关注
			 */
			focus(uid){
				data.friend.focus({
					fid: uid,
					success: () => {
						uni.showToast({
							title: '关注成功！'
						});
						this.lists.forEach((v, i) => {
							if(v.uid == uid){
								v.isFocus = 1;
							}
						});
					}
				});
			},
			/**
			 * 取消关注
			 */
			disFocus(uid){
				data.friend.dis_focus({
					fid: uid,
					success: () => {
						uni.showToast({
							title: '取消关注成功！'
						});
						this.lists.forEach((v, i) => {
							if(v.uid == uid){
								v.isFocus = 0;
							}
						});
					}
				});
			}
		},
	}
</script>

<style lang="less">
	// 引入预先定义好的less
	@import "~@/common/common.less";
</style>
