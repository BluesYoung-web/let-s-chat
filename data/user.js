// 用户模块
import net from '@/core/net.js';
import store from '@/core/store.js';
import err from '@/core/err.js';
import event from '@/core/event.js';
import tools from '@/core/tools.js';

const path = {
    login: '/login.php',
    upload: '/upload.php'
}
const prefix = 'user';

// 登录到服务器
const login_to_service = function(args){
    let {params, success, fail} = {...args};
    net.post({
        path: path.login,
        params,
        success: (res) => {
            // 返回之前处理数据
            let user = res.user;
            // 将用户信息存入state和缓存
            let sign = tools.md5(user.uid + user.token);
            // 存入签名与密码
            user.sign = sign;
            store.set(`${prefix}.account`,user);
            // 连接websocket
            net.init(() => {
                // 连接成功之后,正式返回
                success && success({
                    user,
                    benew: res.benew
                });
            });
        },
        fail
    });
}
// 登录
const login = function(args) {
	let {user, success, fail} = {...args};
	if(!user){
		// 如果没有传则从store获取
		user = store.get({
            key: `${prefix}.account`
        });
		if(!user){
			// 获取失败 -> 重新登录
			err(404);
		}
    }
    try {
        let tel = user.tel;
        let wxid = user.wxid;
        if(tel){
            login_to_service({
                params: {
                    tel
                },
                success,
                fail
            });
        }else{
            login_to_service({
                params: {
                    wxid
                },
                success,
                fail
            });
        }
        
    } catch (error) {
        err(404);
    }
}

export default{
    login,
}