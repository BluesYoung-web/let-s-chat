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
    del: 303
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
                    uid,
                    fid
                },
                success : (res) => {
                    add_to_list({
                        uid,
                        friendInfo: res,
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
 * 添加到好友列表(本地)
 * @param {object} args 
 * @param {number} args.uid 当前用户uid
 * @param {object} args.friendInfo 好友详细信息
 * @param {function} args.success 
 * @param {function} args.fail
 */
const add_to_list = function(args){
    let {uid, friendInfo, success, fail} = {...args};
    // 先获取好友列表
    get_list({
        success: (res) => {
            res.push(friendInfo);
            store.set({
                key: `${prefix}.${uid}.address`,
                data: res,
                success,
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
                    uid,
                    fid
                },
                success : (res) => {
                    del_from_list({
                        uid,
                        fid,
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
 * 从好友列表删除(本地)
 * @param {object} args 
 * @param {number} args.uid 当前用户uid
 * @param {number} args.fid 好友uid
 * @param {function} args.success 
 * @param {function} args.fail
 */
const del_from_list = function(args){
    let {uid, fid, success, fail} = {...args};
    // 先获取好友列表
    get_list({
        success: (res) => {
            res = res.filter((item) => item.uid != fid);
            store.set({
                key: `${prefix}.${uid}.address`,
                data: res,
                success,
                fail
            });
        }
    });
}
export default {
    get_info,
    get_list,
    add,
    del
}