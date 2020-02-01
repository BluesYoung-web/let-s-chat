// 页面请求数据————函数抽取

// 从state获取数据
import store from '@/store/index.js';
// 缓存管理
import service from '@/service.js';

// 服务器地址
const serverUrl=store.getters.serverUrl;
// 本机用户信息
const userInfo=store.getters.userInfo;
// 好友用户信息
const tempInfo=store.getters.tempInfo;
// GET请求
const reqByGet=function(params,success=()=>{console.log("默认成功回调函数")},error=()=>{console.log("默认失败回调函数")},complete=()=>{console.log("默认完成回调函数")}){
	let url=serverUrl+"?";
	for(let i in params){
		url+=i+"="+params[i]+"&";
	}
	// 去掉多余的&
	url=url.slice(0,url.length-1);
	console.log(url);
	uni.request({
		url: url,
		method: 'GET',
		data: {},
		success: (res) => {
			success(res.data);
		},
		fail: (err) => {
			error(err);
		},
		complete: () => {
			complete();
		}
	});
}
// POST请求
const reqByPost=function(params,success=()=>{console.log("默认成功回调函数")},error=()=>{console.log("默认失败回调函数")},complete=()=>{console.log("默认完成回调函数")}){
	console.log("POST");
	let url=serverUrl+"?";
	for(let i in params[0]){
		url+=i+"="+params[0][i]+"&";
	}
	// 去掉多余的&
	url=url.slice(0,url.length-1);
	let temp={};
	for(let i in params[1]){
		temp[i]=params[1][i];
	}
	uni.request({
		url: url,
		method: 'POST',
		header: {
			'content-type':'application/x-www-form-urlencoded',
		},
		data:temp,
		success: (res) => {
			success(res.data);
		},
		fail: (err) => {
			error(err);
		},
		complete: () => {
			complete();
		}
	});
}
// 请求函数列表
const requestList={
	getLatestFriend:'getLatestFriend',
	getUserInfo:'getUserInfo',
	addFriend:'addFriend',
	addFriendByFocus:'addFriend',
	deleteFriend:'deleteFriend',
	deleteFriendByFocus:'deleteFriend',
	changePhone:'changePhone',
	bindPhone:'bindPhone',
	setUserInfo:'setUserInfo',
	chooseImg:'chooseImg',
	checkPhone:'checkPhone',
	registerUser:'bindPhone',
	wxLogin:'wxLogin',
	toMain:'wxCheck',
	phoneLogin:'checkPhone',
	searchUser:'searchUser',
	getLatestFinds:'getLatestFinds',
	putUpFinds:'putUpFinds',
	getComments:'getComments',
	putUpComments:'putUpComments',
	clickLike:'clickLike',
	getLikeLists:'getLikeLists',
	getLikesNum:'getLikesNum',
	getFollowMe:'getFollowMe',
	deleteRelease:'deleteRelease',
	getMyFinds:'getMyFinds'
};
// 根据uid获取用户详细信息
const getUserInfo=function(f_uid,success,error,complete){
	let params={
		op:requestList.getUserInfo,
		uid:f_uid
	}
	return reqByGet(params,success,error,complete);
}
// 通讯录页面,从服务器获取最新数据
const getLatestFriend=function(success,error,complete){
	let params={
		op:requestList.getLatestFriend,
		uid:userInfo.account
	}
	return reqByGet(params,success,error,complete);
}
// 好友信息页面,添加好友
const addFriend=function(success,error,complete){
	let params={
		op:requestList.addFriend,
		user_uid:userInfo.account,
		f_uid:tempInfo.account
	}
	return reqByGet(params,success,error,complete);
}
// 关注我的页面,关注好友
const addFriendByFocus=function(f_uid,success,error,complete){
	let params={
		op:requestList.addFriend,
		user_uid:userInfo.account,
		f_uid:f_uid
	}
	return reqByGet(params,success,error,complete);
}
// 好友信息页面,删除好友
const deleteFriend=function(success,error,complete){
	let params={
		op:requestList.deleteFriend,
		user_uid:userInfo.account,
		f_uid:tempInfo.account
	}
	return reqByGet(params,success,error,complete);
}
// 关注我的页面,删除好友
const deleteFriendByFocus=function(f_uid,success,error,complete){
	let params={
		op:requestList.deleteFriend,
		user_uid:userInfo.account,
		f_uid:f_uid
	}
	return reqByGet(params,success,error,complete);
}
// 更改手机号
const changePhone=function(newPhone,success,error,complete){
	let params=[{
		op:requestList.changePhone
	},{
		user_uid:userInfo.account,
		user_phone:newPhone
	}];
	return reqByPost(params,success,error,complete);
}
// 绑定手机号
const bindPhone=function(success,error,complete){
	let params=[{
		op:requestList.bindPhone
	},{
		user_uid:userInfo.account,
		user_phone:userInfo.phone,
		user_name:userInfo.name,
		user_avatar:userInfo.avatarUrl,
		user_motto:userInfo.motto,
		user_wxid:userInfo.wxId
	}];
	return reqByPost(params,success,error,complete);
}
// 用户修改个人信息之后同步数据库
const setUserInfo=function(success,error,complete){
	let params=[{
		op:requestList.setUserInfo
	},{
		user_uid:userInfo.account,
		user_name:userInfo.name,
		user_avatar:userInfo.avatarUrl,
		user_motto:userInfo.motto,
	}];
	return reqByPost(params,success,error,complete);
}
// 用户修改头像
const chooseImg=function(that,src){
 	let config={
 		count: 1,
 		sourceType:[src],
 		success: res => {
 			// console.log(JSON.stringify(res.tempFilePaths));
			//裁剪图片的路径
			that.tempFilePath = res.tempFilePaths.shift()
 		},
 		fail: res => {
 			uni.showToast({
 				title:"用户取消或加载超时",
 				icon:"none"
 			});
 		},
 	}
 	
 	return uni.chooseImage(config);
 }
// 查询数据库中是否已经存在此手机号
const checkPhone=function(phone,success,error,complete){
	let params={
		op:requestList.checkPhone,
		user_phone:phone
	}
	return reqByGet(params,success,error,complete);
 }
// 用户注册到服务器 
const registerUser=function(success,error,complete){
	 let params=[{
	 	op:requestList.registerUser
	 },{
	 	user_uid:userInfo.account,
	 	user_phone:userInfo.phone,
	 	user_name:userInfo.name,
	 	user_avatar:userInfo.avatarUrl,
	 	user_motto:userInfo.motto,
	 }];
	 return reqByPost(params,success,error,complete);
 }
// 微信登录
const wxLogin=function(that,value){
 	let config={
 		provider: value,
 		success: (res) => {
 			uni.getUserInfo({
 				provider: value,
 				success: (infoRes) => {
 					/**
 					 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
 					 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
 					 */
 					that.toMain(infoRes.userInfo);
 				}
 			});
 		},
 		fail: (err) => {
 			console.error('授权登录失败：' + JSON.stringify(err));
 		}
 	}
 	
 	return uni.login(config);
 }
// 微信登录之后的信息校验
const toMain=function(wxId,success,error,complete){
	let params={
		op:requestList.toMain,
		user_wxid:wxId
	}
	return reqByGet(params,success,error,complete);
 }
// 手机号登录
const phoneLogin=function(phone,success,error,complete){
	let params={
		op:requestList.phoneLogin,
		user_phone:phone
	}
	return reqByGet(params,success,error,complete);
 }
// 搜索好友
const searchUser=function(str,inputMsg,success,error,complete){
	let params={
		op:requestList.searchUser,
		user_uid:userInfo.account,
	}
	if(str=='uid'){
		params.uid=inputMsg;
	}else{
		params.tel=inputMsg;
	}
	return reqByGet(params,success,error,complete);
 }
// 获取最新好友圈
const getLatestFinds=function(page,success,error,complete){
	let params={
		op:requestList.getLatestFinds,
		user_id:userInfo.account,
		page:page
	}
	return reqByGet(params,success,error,complete);
 }
// 获取我发布的好友圈
const getMyFinds=function(account,success,error,complete){
	let params={
		op:requestList.getMyFinds,
		user_id:account,
	}
	return reqByGet(params,success,error,complete);
}
// 发布好友圈
const putUpFinds=function(put,success,error,complete){
	let params=[{
		op:requestList.putUpFinds
	},put];
	return reqByPost(params,success,error,complete);
 }
 
//删除好友圈
const deleteRelease=function(id,success,error,complete){
	let params={
		op:requestList.deleteRelease,
		id:id
	};
	return reqByGet(params,success,error,complete);
}

// 获取所有评论
const getComments=function(id,success,error,complete){
	let params={
		op:requestList.getComments,
		article_id:id
	}
	return reqByGet(params,success,error,complete);
}
// 发表评论
const putUpComments=function(id,content,success,error,complete){
	let params=[{
		op:requestList.putUpComments,
	},{
		article_id:id,
		content:content,
		user_id:userInfo.account
	}]
	return reqByPost(params,success,error,complete);
}
// 点赞/取消点赞
const clickLike=function(id,is_like,success,error,complete){
	let params=[{
		op:requestList.clickLike},{
		article_id:id,
		user_id:userInfo.account,
		is_like:is_like
	}]
	return reqByPost(params,success,error,complete);
}
// 获取点赞者的信息
const getLikeLists=function(id,success,error,complete){
	let params={
		op:requestList.getLikeLists,
		article_id:id
	}
	return reqByGet(params,success,error,complete);
}
// 获取赞我的人
const getLikesNum=function(user_id,success,error,complete){
	let params={
		op:requestList.getLikesNum,
		user_id:user_id
	}
	return reqByGet(params,success,error,complete);
}
// 获取关注我的人
const getFollowMe=function(user_id,success,error,complete){
	let params={
		op:requestList.getFollowMe,
		user_id:user_id
	}
	return reqByGet(params,success,error,complete);
}
export default {
	getLatestFriend,
	getUserInfo,
	addFriend,
	deleteFriend,
	changePhone,
	bindPhone,
	setUserInfo,
	chooseImg,
	checkPhone,
	registerUser,
	wxLogin,
	toMain,
	phoneLogin,
	searchUser,
	getLatestFinds,
	putUpFinds,
	getComments,
	putUpComments,
	clickLike,
	getLikeLists,
	getLikesNum,
	getFollowMe,
	addFriendByFocus,
	deleteFriendByFocus,
	deleteRelease,
	getMyFinds
};