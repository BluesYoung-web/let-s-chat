/**
 * 用户模块 
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */
import net from '@/core/net.js';
import store from '@/core/store.js';
import err from '@/core/err.js';
import event from '@/core/event.js';
import tools from '@/core/tools.js';

/**
 * 路由
 */
const path = {
    login: '/login',
    upload: '/upload'
}
/**
 * 存储前缀
 */
const prefix = 'user';
/**
 * 模块id
 */
const model = 100;
/**
 * 异地登录
 */
event.register({
    model,
    type: 0,
    id: 4000,
    on_event: (mode, type, id, data) => {
        if (type == 0 && id == 4000) {
            err(4000);
        }
    }
});
/**
 * websocket连接断开
 */
event.register({
    model,
    type: 4001,
    id: 0,
    on_event: (model, type, id, data) => {
        if (type == 4001 && id == 0) {
            err(4001);
        }
    }
});
/**
 * 多次自动重连失败
 */
event.register({
    model,
    type: 4002,
    id: 0,
    on_event: (model, type, id, data) => {
        if (type == 4002 && id == 0) {
            err(4002);
        }
    }
});
/**
 * 指令集
 */
const cmds = {
    get_info: 100,
    set_info: 101,
    search: 102
}

/**
 * 登录到服务器
 * @param {object} args
 * @param {object} args.params 用户账户信息
 * @param {function} args.success 登录成功的回调函数 
 * @param {function} args.fail 登录失败的回调函数
 */
const login_to_service = function(args){
    let {params, success, fail} = {...args};
    net.post({
        path: path.login,
        params,
        success: (res) => {
			console.log(res);
            /**
             * 用户相关信息
             * @property {number} uid uid
             * @property {string} sign 签名
             */
            let user = res.user;
            // 将用户信息存入state和缓存
            let sign = tools.md5(user.uid + user.token);
            // 存入签名与密码
            user.sign = sign;
            store.set({
                key: `${prefix}.account`,
                data: user
            });
            // 连接websocket
            net.init(() => {
                success && success({
                    user,
                    bnew: res.bnew
                });
            });
        },
        fail
    });
}
/**
 * 登录之前的处理(外部调用)
 * @param {object} args
 * @param {object} args.user 用户账户信息
 * @param {function} args.success 登录成功的回调函数 
 * @param {function} args.fail 登录失败的回调函数
 */
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
/**
 * 退出登录
 * @param {object} args  
 * @param {function} args.success 退出登录成功的回调函数 
 * @param {function} args.fail 退出登录失败的回调函数
 */
const login_out = function (args) {
    let {success, fail} = {...args};
    net.close();
    store.del({
        key: `${prefix}.account`,
        success,
        fail
    });
}

/**
 * 用户上传文件(图片、语言)的函数
 * @param {object} args 
 * @param {string} args.filePath 文件本地路径
 * @param {string} args.name 文件对象中的键名 img/audio
 * @param {function} args.success 上传成功的回调函数 
 * @param {function} args.fail 上传失败的回调函数
 */
const upload = function(args){
	let {filePath, name, success, fail} = {...args};
	net.upload({
		path: path.upload,
		filePath,
		name,
		success: (res) => {
			let rs = JSON.parse(res.data);
			success(rs);
		},
		fail
	});
}
/**
 * 获取当前用户信息
 * @param {object} args
 * @param {boolean} args.force 是否强制从服务器获取 
 * @param {function} args.success 获取成功的回调函数 
 * @param {function} args.fail 获取失败的回调函数
 */
const get_info = function(args){
	let {force, success, fail} = {...args};
	let req = {
		cmd: cmds.get_info,
		data: {},
	}
    let userInfo = store.get({
        key: `${prefix}.info`,
        req,
        success,
        fail,
        force
    });
	return userInfo;
}
/**
 * 设置当前用户信息
 * @param {object} args
 * @param {object} args.data 用户信息
 * @param {object} args.extra 透传参数
 * @param {function} args.success 设置成功的回调函数 
 * @param {function} args.fail 设置失败的回调函数
 */
const set_info = function(args){
    let {data, extra, success, fail} = {...args};
    let req = {
		cmd: cmds.set_info,
        data,
        extra
	}
	let res = store.set({
        key: `${prefix}.info`,
        data,
        req,
        success, 
        fail
    });
	return res;
}
/**
 * 微信登录（强制绑定手机号）
 * @param {object} args 
 * @param {object} args.data 用户信息
 * @param {function} args.success 绑定成功的手机号 
 * @param {function} args.fail 绑定失败的手机号 
 */
const bind_tel = function(args){
    let {data, success, fail} = {...args};
    login_to_service({
        params: data,
        success,
        fail
    });
}
/**
 * 搜索用户(模糊查询)
 * @param {object} args 
 * @param {number | string} args.key 搜索关键字(uid | nick | tel)
 * @param {function} success
 * @param {function} fail
 */
const search = function(args){
    let {key, success, fail} = {...args};
    let cmd = cmds.search;
    net.send({
        cmd,
        data:{
            key
        },
        success,
        fail
    });
}
export default{
    login,
    login_out,
    upload,
    get_info,
    set_info,
    bind_tel,
    search
}