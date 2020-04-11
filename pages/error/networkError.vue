<template>
	<view class="main-wrapper">
		<view class="inner-wrapper">
			<view class="title">
				您的设备可能未启用移动网络或WI-FI网络，可以参照以下方法进行设置：
			</view>
			<view class="content">
				<view>
					1、打开设备的<text class="strong">"设置"-"Wi-Fi网络"</text>设置面板选择一个可用的Wi-Fi接入。
				</view>
				<view>
					2、打开设备的<text class="strong">"设置"-"蜂窝移动网络"</text>设置面板启用蜂窝数据。
				</view>
			</view>
			<view class="content">
				<view>
					<text class="strong">如果您已经接入WiFi网络</text>
				</view>
				<view>
					<text>请检查该Wi-Fi热点是否已经接入互联网，或该Wi-Fi是否允许你的设备访问互联网</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style>
	.main-wrapper {
		position: absolute;
		display: flex;
		height: 100%;
		width: 100%;
		align-items: center;
		justify-content: center;
		line-height: 1.5em;
	}
	
	.main-wrapper .inner-wrapper{
		width: 80%;
		padding-bottom: 200rpx;
	}
	
	.title {
		font-size: 36rpx;
		color: #333;
	}
	
	.content {
		margin-top: 60rpx;
	}
	
	.content view {
		color: #999;
		font-size: 30rpx;
	}
	
	.content .strong{
		color: #333;
	}
</style>
