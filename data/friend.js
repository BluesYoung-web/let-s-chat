/**
 * 好友模块 
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

import store from '@/core/store.js';
import data from '@/data.js';
import net from '@/core/net.js';
import err from '@/core/err.js';
import event from '@/core/event.js';
import tools from '@/core/tools.js';
/**
 *  存储前缀
 */
const prefix = 'friend';

/**
 * 模块id
 */
const model = 102;

/**
 * 指令集
 */
const cmds = {
    get_info: 300,
    get_list: 301,
    add: 302,
    del: 303,
    focus: 304,
    dis_focus: 305,
    friend_check: 306,
    get_follows: 307,
    get_focus_list: 308,
    get_release: 309
}

/**
 * 根据uid获取用户详细信息
 * @param {object} args
 * @param {number} args.uid 好友uid
 * @param {boolean} args.force 是否强制获取最新的信息
 * @param {function} args.success 获取成功的回调函数
 * @param {function} args.fail 获取失败的回调函数
 */
const get_info = function(args){
    let {uid, force, success, fail} = {...args};
    let req = {
        cmd: cmds.get_info,
        data: {
            uid
        }
    }
    store.get({
        key: `${prefix}.${uid}.info`,
        success,
        fail,
        force,
        req
    });
}

/**
 * 获取当前用户的好友列表
 * @param {object} args
 * @param {boolean} args.force 是否强制获取最新的好友列表
 * @param {function} args.success
 * @param {function} args.fail
 */
const get_list = function(args){
    let {force, success, fail} = {...args};
    // 先获取当前用户uid，避免切换用户之后好友列表错误的bug
    data.user.get_info({
        success: (res) => {
            let req = {
                cmd: cmds.get_list,
                data: {}
            }
            store.get({
                key: `${prefix}.${res.uid}.address`,
                req,
                force,
                success,
                fail
            });
        }
    });
}
/**
 * 加好友
 * @param {object} args 
 * @param {number} args.fid 好友uid
 * @param {function} args.success
 * @param {function} args.fail
 */
const add = function(args){
    let {fid, success, fail} = {...args};
    data.user.get_info({
        success: (result) => {
            net.send({
                cmd: cmds.add,
                data: {
                    uid: fid
                },
                success : (res) => {
                    store.set({
                        key: `${prefix}.${result.uid}.address`,
                        data: res,
                        success,
                        fail
                    });
                },
                fail
            });
        }
    });
}

/**
 * 删好友
 * @param {object} args 
 * @param {number} args.fid 好友uid
 * @param {function} args.success
 * @param {function} args.fail
 */
const del = function(args){
    let {fid, success, fail} = {...args};
    data.user.get_info({
        success: (result) => {
            net.send({
                cmd: cmds.del,
                data: {
                    uid: fid
                },
                success : (res) => {
                    store.set({
                        key: `${prefix}.${result.uid}.address`,
                        data: res,
                        success,
                        fail
                    });
                },
                fail
            });
        }
    });
}
/**
 * 关注
 * @param {object} args 
 * @param {number} args.fid 好友uid
 * @param {function} args.success
 * @param {function} args.fail
 */
const focus = function(args){
    let {fid, success, fail} = {...args};
    net.send({
        cmd: cmds.focus,
        data: {
            uid: fid
        },
        success,
        fail
    });
}
/**
 * 取关
 * @param {object} args 
 * @param {number} args.fid 好友uid
 * @param {function} args.success
 * @param {function} args.fail
 */
const dis_focus = function(args){
    let {fid, success, fail} = {...args};
    net.send({
        cmd: cmds.dis_focus,
        data: {
            uid: fid
        },
        success,
        fail
    });
}
/**
 * 获取粉丝列表
 * @param {object} args
 * @param {number} args.uid 用户uid
 * @param {function} args.success
 * @param {function} args.fail
 */
const get_follows = function(args){
    let {uid, success, fail} = {...args};
    net.send({
        cmd: cmds.get_follows,
        data: {
            uid
        },
        success,
        fail
    });
}

/**
 * 获取关注列表
 * @param {object} args
 * @param {number} args.uid 用户uid
 * @param {function} args.success
 * @param {function} args.fail
 */
const get_focus_list = function(args){
    let {uid, success, fail} = {...args};
    net.send({
        cmd: cmds.get_focus_list,
        data: {
            uid
        },
        success,
        fail
    });
}

/**
 * 获取发表列表
 * @param {object} args
 * @param {number} args.uid 用户uid
 * @param {function} args.success
 * @param {function} args.fail
 */
const get_release = function(args){
    let {uid, success, fail} = {...args};
    net.send({
        cmd: cmds.get_release,
        data: {
            uid
        },
        success,
        fail
    });
}
export default {
    get_info,
    get_list,
    add,
    del,
    focus,
    dis_focus,
    get_follows,
    get_focus_list,
    get_release
}