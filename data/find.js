/**
 * 朋友圈模块 
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
const prefix = 'find';

/**
 * 模块id
 */
const model = 101;

/**
 * 指令集
 */
const cmds = {
    put_up: 200,
    get: 201,
    del: 203,
    like: 204,
    dislike: 205,
    put_comments: 206,
    del_comments: 207
}
/**
 * 发布好友圈
 * @param {object} args 
 * @param {object} args.data 
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const put_up = function(args){
    let {data, success, fail} = {...args};
    net.send({
        cmd: cmds.put_up,
        data,
        success,
        fail
    });
}
/**
 * 获取好友圈
 * @param {object} args 
 * @param {number} args.page 分页 
 * @param {boolean} args.force 是否强制从服务器获取
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const get = function(args){
    let {page, force, success, fail} = {...args};
    let req = {
        cmd: cmds.get,
        data: {
            page
        }
    }
    data.user.get_info({
        success: (res) => {
            store.get({
                key: `${res.uid}.finds.${page}`,
                req,
                success,
                fail,
                force
            });
        }
    });
}
/**
 * 删除好友圈
 * @param {object} args 
 */
const del = function(args){

}
/**
 * 点赞
 * @param {object} args 
 */
const like = function(args){

}
/**
 * 取消点赞
 * @param {object} args 
 */
const dislike = function(args){

}
/**
 * 发表评论
 * @param {object} args 
 */
const put_comments = function(args){

}
/**
 * 删除评论
 * @param {object} args 
 */
const del_comments = function(args){

}
export default {
    put_up,
    get,
    del,
    like,
    dislike,
    put_comments,
    del_comments
}