/**
 * 朋友圈模块 
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */
import store from '@/core/store.js';
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
 */
const put_up = function(args){
    
}
/**
 * 获取好友圈
 * @param {object} args 
 * @param {number} args.page 分页 
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const get = function(args){
    let {page, success, fail} = {...args};
    net.send({
        cmd: cmds.get,
        data: {
            page
        },
        success, 
        fail
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