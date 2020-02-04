// 错误处理

// 错误代码与错误提示的对应关系
const errCode = {
    404: "登录信息过期，请重新登陆"
}
// 错误处理页面的路径
const errorPage = '/pages/error/error';
// 错误处理函数
const error = function(code){
    uni.reLaunch({
        url:`${errorPage}?code=${code}&err=${errCode[code]}`
    });
}

export default{
    error
}