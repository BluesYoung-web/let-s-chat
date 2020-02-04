// 常用工具函数
import md5 from '@/js_sdk/md5.min.js';

// 手机号判断
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