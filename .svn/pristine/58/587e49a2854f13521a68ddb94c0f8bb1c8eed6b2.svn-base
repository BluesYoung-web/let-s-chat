// 工具函数抽取

// 手机号判断
const phoneCheck=function(phone,success=()=>{},error=()=>{}){
	let myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
	if(myreg.test(phone)){
		success();
	}else{
		error();
	}
}
// 生成8位随机数
const generate8=function(){
	let i=Math.random()*100000000;
	i=i.toFixed(0);
	return i;
}
// 时间抽取
const timeProcess=function(arr){
	const nowTime = Date.parse(new Date());
	const oldTime = arr[0].time;
	let d = nowTime - oldTime;
	if(d < 86400000){
		// 显示时间
		arr[0].showTime=new Date(oldTime).toTimeString().substr(0,5);
		
	}else if(d > 86400000 && d < 172800000){
		// 显示昨天+时间
		arr[0].showTime="昨天"+new Date(oldTime-86400000).toTimeString().substr(0,5);
	}else{
		// 直接显示日期+时间
		let t=new Date(oldTime);
		arr[0].showTime=`${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日${t.getHours()}:${t.getMinutes()}`;
	}
	arr[0].ifShow=true;
	for (let i=1;i<arr.length;i++) {
		let diff=arr[i].time-arr[i-1].time;
		let tp='';
		let ifShow=true;
		if(diff <= 60000){
			ifShow=false;
			tp=new Date(arr[i].time).toTimeString().substr(0,5);
		}else if(diff > 60000 && diff <= 86400000){
			if(arr[0].showTime.length == 5){
				tp=new Date(arr[i].time).toTimeString().substr(0,5);
			}else if(arr[0].showTime.includes("昨天")){
				tp="昨天"+new Date(arr[i].time-86400000).toTimeString().substr(0,5);
			}else{
				let t=new Date(arr[i].time);
				tp=`${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日${t.getHours()}:${t.getMinutes()}`;
			}
		}else{
			let t=new Date(arr[i].time);
			tp=`${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日${t.getHours()}:${t.getMinutes()}`;
		}
		arr[i].showTime=tp;
		arr[i].ifShow=ifShow;
	}
	return arr;
}
// showTime
const showTime=function(time){
	const nowTime = Date.parse(new Date());
	const oldTime = time;
	let d = nowTime - oldTime;
	let ts = '';
	if(d < 86400000){
		// 显示时间
		ts=new Date(oldTime).toTimeString().substr(0,5);
	}else if(d > 86400000 && d < 172800000){
		// 显示昨天+时间
		ts="昨天"+new Date(oldTime-86400000).toTimeString().substr(0,5);
	}else{
		// 直接显示日期+时间
		let t=new Date(oldTime);
		ts=`${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日}`;
	}
	return ts;
}

export default{
	phoneCheck,
	generate8,
	timeProcess,
	showTime
}