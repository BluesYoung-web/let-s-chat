/**
 * 错误处理模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */


import net from '@/core/net.js';
/**
 * 错误代码与错误提示的对应关系
 */
const errCode = {
    404: "登录信息过期，请重新登陆",
    4000: '账号异地登录，请重新登录',
    4001: 'websocket连接断开，点击使用自动重连',
    4002: '多次自动重连失败，请确认网络正常之后使用重启大法',
    4003: 'token验证失败，请重新登录'
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
    if (code == 4001) {
        uni.showModal({
            title:"提示",
            content: errCode[code],
            success: (res) => {
                if (res.confirm) {
                    net.auto_reconnect();
                }
            },
            showCancel: false
        });
    }else{
        uni.reLaunch({
            url:`${errorPage}?code=${code}&err=${errCode[code]}`
        });
    }
    
}

export default error;