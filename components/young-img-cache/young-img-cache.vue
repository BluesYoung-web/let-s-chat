<template>
	<image :src="realSrc" :mode="mode" :lazy-load="lazyLoad" :style="setStyle"
	@tap="clickImg"></image>
</template>

<script>
	export default {
		name: 'imgCache',
		data(){
			return {
				realSrc: ''
			}
		},
		props: {
			src: {
				type: String,
				default: ''
			},
			defaultImg:{
				type: String,
				default: ''
			},
			lazyLoad: {
				type: Boolean,
				default: true
			},
			setStyle: {
				type: String,
				default: ''
			},
			mode: {
				type: String,
				default: 'aspectFill'
			}
		},
		watch: {
			realSrc: {
				handler(newVal, oldVal){
					if (! this.src.includes('http')) {
						this.realSrc = this.src;
					}else{
						// #ifndef H5
						uni.getStorage({
							key: this.src,
							success: (res) => {
								if (res.data != '') {
									this.realSrc = res.data;
								} else {
									this.downLoadImg();
								}
							},
							fail: () => {
								this.downLoadImg();
							}
						});
						// #endif
						// #ifdef H5
						this.realSrc = this.src;
						// #endif
					}
				},
				immediate: true
			}
		},
		methods: {
			downLoadImg(){
				uni.downloadFile({
					url: this.src,
					success: (res) => {
						if (res.statusCode == 200) {
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: (res) => {
									let saveFile = res.savedFilePath;
									uni.setStorage({
										key: this.src,
										data: saveFile,
										success: () => {
											this.realSrc = saveFile;
										}
									});
								}
							});
						}else{
							this.realSrc = this.defaultImg;
						}
					},
					fail: () => {
						this.realSrc = this.defaultImg;
					}
				});
			},
			clickImg(){
				this.$emit('clickAvatar');
			}
		}
	}
</script>

<style>

</style>
