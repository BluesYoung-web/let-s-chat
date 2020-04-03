/**
 * 常用工具函数 
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * @typedef {function} md5 md5加密函数
 */
import md5 from '@/js_sdk/md5.min.js';

/**
 * 判断是否为合法手机号
 * @param {string} phone 手机号
 * @return {boolean} true/false
 */
const phoneCheck = function(phone){
	let myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
	if(myreg.test(phone)){
		return true;
	}else{
		return false;
	}
}

/**
 * 将时间戳转换成特定格式的时间
 * @param {timestamp} timestamp 时间戳
 * @return {string} str 处理后的时间
 */
const timeFormat = function(timestamp){
	if(!Number(timestamp)){
		return timestamp;
	}
	const nowTime = Date.parse(new Date());
	let d = nowTime - timestamp;
	let diff = new Date(nowTime).toDateString().substr(8,2) - new Date(timestamp).toDateString().substr(8,2);
	let str = '';
	if (d <= 60000) {
		str = '';
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
/**
 * 计算时间间隔，并决定是否显示
 * @param {timestamp} ot 当前时间戳
 * @param {timestamp} lt 上一条消息的时间戳
 * @param {number} diff 时间间隔
 * @return {string} str '空'/'具体时间'
 */
const timeDec = function(ot, lt, diff){
	let str = '';
	let dec = ot - lt;
	if(dec > diff){
		str = timeFormat(ot);
	}
	return str;
}
export default{
    md5,
	phoneCheck,
	timeFormat,
	timeDec
}