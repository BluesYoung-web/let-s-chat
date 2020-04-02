/**
 * 用于存储用户数据的模块 
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */
/**
 * @typedef {object} Cache 存储类
 */
import Cache from '@/core/class/cache.js';
import net from '@/core/net.js';

/**
 * 存储对象 
 * @type {Cache} store
 */
let store = new Cache('store', 'data');
/**
 * 获取存储的值
 * @param {object} args 
 * @param {string} args.key 键名
 * @param {object} args.req  请求参数
 * @param {boolean} args.force 是否强制获取最新数据
 * @param {function} args.success 获取成功的回调函数
 * @param {function} args.fail 获取失败的回调函数
 */
const get = function(args){
    let {key, req, success, fail, force} = {...args};
    if(!force){
        // 如果不是强制，先从缓存获取
        let data = store.get(key);
        if(!data && req){
            // 拿不到数据且有请求参数，再从服务器获取
            net.send({
                cmd: req.cmd,
                data: req.data,
                extra: req.extra,
                success: (res) => {
                    store.set(key, res);
                    success && success(res);
                    return res;
                },
                fail: (code, err) => {
                    fail && fail(code, err);
                    return null;
                }
            });
        }else{
            // 如果拿到数据或没有请求参数，直接返回数据
            success && success(data);
            return data;
        }
    }else if(req){
        // 有请求参数，直接从服务器获取
        net.send({
            cmd: req.cmd,
            data: req.data,
            extra: req.extra,
            success: (res) => {
                store.set(key, res);
                success && success(res);
                return res;
            },
            fail: (code, err) => {
                fail && fail(code, err);
                return null;
            }
        });
    }else{
        // 强制从服务器获取，但是又没有传递参数
        fail && fail(4000, "请传递请求参数");
        return null;
    }
}
/**
 * 设置存储的值
 * @param {object} args 
 * @param {string} args.key 键名
 * @param {object} args.req  请求参数 
 * @param {object} args.data 要存储的键值
 * @param {function} args.success 设置成功的回调函数
 * @param {function} args.fail 设置失败的回调函数
 */
const set = function(args){
    let {key, data, req, success, fail} = {...args};
    // 如果没有要求同步到服务器，直接存在本地
    if(!req){
        store.set(key, data);
        success && success(key+"存储成功");
    }else{
        // 先存到服务器，再更新本地存储
        net.send({
            cmd: req.cmd,
            data: req.data,
            extra: req.extra,
            success: (res) => {
                store.set(key, data);
                success && success(res);
                return res;
            },
            fail: (code, err) => {
                fail && fail(code, err);
                return null;
            }
        });
    }
}
/**
 * 删除存储的值
 * @param {object} args 
 * @param {string} args.key 键名
 * @param {function} args.success 删除成功的回调函数
 * @param {function} args.fail 删除失败的回调函数
 */
const del = function(args){
    let {key, success, fail} = {...args};
    let res = store.del(key);
    if(res){
        success && success(key+"删除成功");
    }else{
        fail && fail(4002, key+"删除失败");
    }
}
export default {
    get,
    set,
    del
}