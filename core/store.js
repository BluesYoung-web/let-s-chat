// 存储用户数据
import Cache from '@/core/class/cache.js';
import net from '@/core/net.js';
let store = new Cache('store', 'data');
// 获取数据
const get = function(args){
    let {key, req, success, fail, force} = {...args};
    if(!force){
        // 如果不是强制，先从缓存获取
        let data = store.get(key);
        if(!data){
            // 拿不到数据，再从服务器获取
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
            // 如果拿到数据，直接返回数据
            success && success(data);
            return data;
        }
    }else{
        // 直接从服务器获取
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
    }
}
// 存储数据
const set = function(args){
    let {key, value, success, fail} = {...args};
    let res = store.set(key, value);
    if(res){
        success && success(key+"存储成功");
    }else{
        fail && fail(400, key+"存储失败");
    }
}
// 删除数据
const del = function(args){
    let {key, success, fail} = {...args};
    let res = store.del(key);
    if(res){
        success && success(key+"删除成功");
    }else{
        fail && fail(401, key+"删除失败");
    }
}
export default {
    get,
    set,
    del
}