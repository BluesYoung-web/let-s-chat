/**
 * 错误处理模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 错误代码与错误提示的对应关系
 */
const errCode = {
    404: "登录信息过期，请重新登陆",
    4000: '账号异地登录，请重新登录'
}
/**
 * 错误处理页面的路径
 */
const errorPage = '/pages/error/error';
/**
 * 错误处理函数
 * @param {number} code 错误码
 */
const error = function(code){
    uni.reLaunch({
        url:`${errorPage}?code=${code}&err=${errCode[code]}`
    });
}

export default error;