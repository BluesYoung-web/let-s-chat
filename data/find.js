/**
 * 朋友圈模块 
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */
import store from '@/core/store.js';
import data from '@/data.js';
import net from '@/core/net.js';
import event from '@/core/event.js';
/**
 *  存储前缀
 */
const prefix = 'find';

/**
 * 模块id
 */
const model = 101;
event.register({
    model,
    type: 0,
    id: 0,
    on_event: (model, type, id, data) => {
        console.log(data);
        uni.$emit('newFinds');
        uni.$emit('hasNewCircle');
    }
});
/**
 * 指令集
 */
const cmds = {
    put_up: 200,
    get: 201,
    del: 202,
    like: 203,
    dislike: 204,
    put_comments: 205,
    del_comments: 206,
    get_likes: 207,
    get_comments: 208,
    get_my_release: 209,
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
    let {findId, pagecount, success, fail} = {...args};
    net.send({
        cmd: cmds.del,
        data: {
            findId
        },
        success: () => {
            data.user.get_info({
                success: (res) => {
                    for(let i = 1; i <= pagecount; i++){
                        store.del({
                            key: `${res.uid}.myFinds.${i}`
                        });
                    }
                }
            });
            success();
        },
        fail
    });
}
/**
 * 点赞
 * @param {object} args 
 * @param {number} args.findId
 * @param {Function} args.success
 * @param {Function} args.fail 
 */
const like = function(args){
    let {findId, success, fail} = {...args};
    net.send({
        cmd: cmds.like,
        data:{
            findId
        },
        success,
        fail
    });
}
/**
 * 取消点赞
 * @param {object} args 
 * @param {number} args.findId
 * @param {Function} args.success
 * @param {Function} args.fail 
 */
const dislike = function(args){
    let {findId, success, fail} = {...args};
    net.send({
        cmd: cmds.dislike,
        data:{
            findId
        },
        success,
        fail
    });
}
/**
 * 发表评论
 * @param {object} args 
 * @param {object} args.data 评论数据 
 * @param {Function} args.success 
 * @param {Function} args.fail 
 */
const put_comments = function(args){
    let {data, success, fail} = {...args};
    net.send({
        cmd: cmds.put_comments,
        data,
        success,
        fail
    });
}
/**
 * 删除评论
 * @param {object} args 
 */
const del_comments = function(args){

}
/**
 * 获取点赞列表
 * @param {object} args 
 * @param {number} args.findId 好友圈id
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const get_likes = function(args){
    let {findId, success, fail} = {...args};
    net.send({
        cmd: cmds.get_likes,
        data: {
            findId
        },
        success,
        fail
    });
}
/**
 * 获取评论列表
 * @param {object} args 
 * @param {number} args.findId 好友圈id
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const get_comments = function(args){
    let {findId, success, fail} = {...args};
    net.send({
        cmd: cmds.get_comments,
        data: {
            findId
        },
        success,
        fail
    });
}
/**
 * 获取我发表的好友圈
 * @param {number} args.page 分页 
 * @param {boolean} args.force 是否强制从服务器获取
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const get_my_release = function(args){
    let {page, force, success, fail} = {...args};
    let req = {
        cmd: cmds.get_my_release,
        data: {
            page
        }
    }
    data.user.get_info({
        success: (res) => {
            store.get({
                key: `${res.uid}.myFinds.${page}`,
                req,
                success,
                fail,
                force
            });
        }
    });
}
/**
 * 清空好友圈缓存
 * @param {object} args 
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const clear_cache = function(args){
    let {success, fail} = {...args};
    get({
        page: 1,
        success: (res) => {
            let pagecount = res.pagecount;
            data.user.get_info({
                success: (res) => {
                    for(let i = 1; i <= pagecount; i++){
                        store.del({
                            key: `${res.uid}.finds.${i}`
                        });
                    }
                    success && success('已清空好友圈缓存');
                }
            });
        },
        fail
    });
}
export default {
    put_up,
    get,
    del,
    like,
    dislike,
    put_comments,
    del_comments,
    get_likes,
    get_comments,
    get_my_release,
    clear_cache
}