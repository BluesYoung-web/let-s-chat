<template>
	<view>
		<view class="flex flex-vc flex-direction-column pd-tp150">
			<image class="width-200 height-200" src="/static/img/logo.png" mode=""></image>
			<text class="color-344955 ft-32 font-weight-550 mg-tp30">来聊 version {{version}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				version: "1.0.1", //版本
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
