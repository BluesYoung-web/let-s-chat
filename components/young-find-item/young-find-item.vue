<template>
    <view>
        <!-- 好友动态信息 -->
        <view class="dynamic-information">
            <!-- 好友头像 -->
            <view class="friends-head" @tap="toFriendsInfo(item.userId)">
				<img-cache defaultImg="/static/img/finds_01.jpg" :src="item.avatar"></img-cache>
            </view>
            <!-- 好友信息 -->
            <view class="friends-information">
                <!-- 好友昵称 -->
                <view class="friends-username">
                    <span>{{item.nick}}</span>
                </view>
                <!-- 好友发布动态时间 -->
                <view class="dynamic-time flex flex-vc">
                    <image src="/static/img/clock.png" mode=""></image>
                    <span class="mg-lt10 inline-block">{{showTime(item.ot)}}</span>
                </view>
				<!-- 删除按钮 -->
				<view v-if="showDel" class="del" @tap="del(item)">
				    <text>删除</text>
				</view>
            </view>
        </view>
        <!-- 标题 -->
        <view class="pd-lt30">
            <text v-if="item.say">{{item.say}}</text>
        </view>
        <!-- 动态图片 -->
        <view class="dynamic-img" @tap="watchImg(item.img)">
            <!-- <image :src="item.img" mode="aspectFit"></image> -->
			<img-cache defaultImg="/static/img/finds_01.jpg" :src="item.img"
			></img-cache>
        </view>
        <!-- 赞与留言 -->
        <view class="likes-comments">
            <!-- 点赞 -->
            <view class="likes" @tap="like(item)">
                <view class="flex flex-vc width-80 flex-jsb">
                    <view class="height-50">
                        <image v-if="item.likeAction == 1" src="/static/img/heart2.png" mode=""></image>
                        <image v-else src="/static/img/heart.png" mode=""></image>
                    </view>
                    <span class="inline-block width-20">{{item.likesNum}}</span>
                </view>
            </view>
            <!-- 评论 -->
            <view class="comments" @tap="comment(item)">
                <view class="flex flex-vc width-80 flex-jsb">
                    <view class="height-50">
                        <image src="/static/img/comment.png" mode=""></image>
                    </view>
                    <span class="inline-block width-20">{{item.commentsNum}}</span>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import imgCache from '@/components/young-img-cache/young-img-cache.vue';
export default {
    /**
     * 组件名
     */
    name: 'findItem',
	/**
	 * 组件依赖
	 */
	components: {
		imgCache
	},
    /**
     * 参数
     */
    props: {
        item: {
            type: Object,
            default(){
                return {}
            }
        },
        showDel: {
            type: Boolean,
            default: false
        }
    },
    /**
     * 方法
     */
    methods: {
        /**
         * 查看图片
         * @param {string} src 图片url
         */
        watchImg(src){
            this.$emit('watchImg', src);
        },
        /**
         * 点赞
         * @param {object} item 单条好友圈对象
         */
        like(item){
            this.$emit('like', item);
        },
        /**
         * 查看图片
         * @param {object} item 单条好友圈对象
         */
        comment(item){
            this.$emit('comment', item);
        },
        /**
         * 删除好友圈
         */
        del(item){
            this.$emit('del', item);
        },
        /**
         * 显示时间处理
         * @param {number} timestamp 原始时间戳
         */
        showTime(timestamp){
            timestamp = Number(timestamp);
            const nowTime = Date.parse(new Date());
            let d = nowTime - timestamp;
            let diff = new Date(nowTime).toDateString().substr(8,2) - new Date(timestamp).toDateString().substr(8,2);
            let str = '';
            if (d <= 60000) {
                str = '刚刚';
            } else if(d > 60000 && diff == 0){
                // 显示时间
                str = new Date(timestamp).toTimeString().substr(0,5);
            }else if(diff == 1){
                // 显示昨天+时间
                str = "昨天"+new Date(timestamp - 86400000).toTimeString().substr(0,5);
            }else{
                // 直接显示日期+时间
                let t = new Date(timestamp);
                str = `${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日  ${t.getHours()}:${t.getMinutes()}`;
            }
            return str;
        }
    }
}
</script>

<style>
    .height-50{
        height: 50upx;
    }
    .width-80{
        width: 80upx;
    }
    .width-20{
        width: 20upx;
    }
    .pd-lt30{
        padding-left: 30upx;
    }
    .mg-lt10{
        margin-left: 10upx;
    } 
    .inline-block{
        display: inline-block;
    }
    /* flex布局属性集 */
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
    .flex-jsb { 
        justify-content: space-between;
    }

    .dynamic-information {
        height: 120upx;
    }

    .friends-head {
        display: flex;
        justify-content: center;
        align-items: center;
        float: left;
        width: 150upx;
        height: 100%;
    }

    .friends-head image {
        width: 90upx;
        height: 90upx;
        border-radius: 50%;
    }


    .friends-username {
        height: 55upx;
        display: flex;
        align-items: flex-end;
        font-size: 30upx;
        font-weight: bold;
    }

    .dynamic-time {
        height: 65upx;
        display: flex;
    }

    .dynamic-time image {
        width: 26upx;
        height: 26upx;
    }

    .dynamic-time span {
        font-size: 24upx;

    }

    .dynamic-img {
        width: 100%;
        height: 500upx;
    }

    .dynamic-img image {
        height: 100%;
        width: 100%;
    }

    .likes-comments {
        height: 100upx;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .likes, .comments {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 100%;
    }

    .likes image, .comments image {
        width: 50upx;
        height: 50upx;
    }
    .del{
        color: red;
        font-size: 28upx;
        position: relative;
        float: right;
        top: -100upx;
        right: 20upx;
    }
</style>