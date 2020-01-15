
// 管理信息缓存
// 关键字列表
const keyList={
	USERS_KEY : 'USERS_KEY',
	FRIEND_LIST:'FRIEND_LIST',
	FINDSLIST:'FINDSLIST',
	CONVERSATION:'CONVERSATION'
}
// get方法抽取
const get=function(key){
	let ret = '';
	ret = uni.getStorageSync(key);
	if (!ret) {
	    ret = '[]';
	}
	return JSON.parse(ret);
}
// add方法抽取
const add=function (key,lists) {
	// console.log("缓存存入"+JSON.stringify(lists));
	uni.setStorage({
		key : key,
		data : JSON.stringify(lists),
		success: () => {
			console.log("缓存存入成功");
		}
	})
}
// 获取用户信息
const getUsers = function () {
    let key=keyList.USERS_KEY;
	return get(key);
}
// 储存用户信息
const addUser = function (userInfo) {
    let lists='['+JSON.stringify(userInfo)+']';
	lists=JSON.parse(lists);
    let key=keyList.USERS_KEY;
	return add(key,lists);
}
// 获取好友信息
const getFriends = function () {
    let key=keyList.FRIEND_LIST;
    return get(key);
}
// 存储好友信息
const addFriends = function (lists) {
	let key=keyList.FRIEND_LIST;
	return add(key,lists);
}
// 获取好友圈信息
const getFinds = function () {
    let key=keyList.FINDSLIST;
    return get(key);
}
// 存储好友圈信息
const addFinds = function (lists) {
	let key=keyList.FINDSLIST;
	return add(key,lists);
}
// 获取聊天记录
const getConversation = function(){
	let key=keyList.CONVERSATION;
	return get(key);
}
// 存储聊天记录
const addConversation = function(lists){
	let key=keyList.CONVERSATION;
	return add(key,lists);
}
export default {
    getUsers,
    addUser,
	getFriends,
	addFriends,
	getFinds,
	addFinds,
	getConversation,
	addConversation,
	keyList
}
