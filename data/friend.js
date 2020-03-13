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
    dis_focus: 305
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
        success: (uid) => {
            let req = {
                cmd: cmds.get_list,
                data: {}
            }
            store.get({
                key: `${prefix}.${uid}.address`,
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
        success: (uid) => {
            net.send({
                cmd: cmds.add,
                data: {
                    uid: fid
                },
                success : (res) => {
                    store.set({
                        key: `${prefix}.${uid}.address`,
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
        success: (uid) => {
            net.send({
                cmd: cmds.del,
                data: {
                    uid: fid
                },
                success : (res) => {
                    store.set({
                        key: `${prefix}.${uid}.address`,
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
 * 关注好友
 * @param {object} args 
 * @param {number} args.fid 好友uid
 * @param {function} args.success
 * @param {function} args.fail
 */
const focus = function(args){
    let {fid, success, fail} = {...args};
    
}
export default {
    get_info,
    get_list,
    add,
    del
}