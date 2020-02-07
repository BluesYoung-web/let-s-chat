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
export default{
    md5,
	phoneCheck
}