/**
 * 用于处理接收到的socket消息的类
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

 class Socket{
    /**
     * @param {number} uid 客户端用户的uid
     * @param {object} conn websocket客户端连接对象
     * @param {object} server 服务器对象
     */
    constructor(uid, conn, server){
        this.uid = uid;
        this.conn = conn;
        this.server = server;
    }
    /**
     * 获取在线用户列表
     */
    getOnlines(){
        let connections = this.server.connections;
        const onlines = {};
        const {paramsSeparate} = require('../core/tools');
        for (let i of connections) {
            let {uid} = paramsSeparate(i.path)
            onlines[uid] = i;
        }
        return onlines;
    }
    /**
     * 消息处理
     * @param {object} args 
     * @param {number} args.cmd 操作码
     * @param {object} args.data 参数
     * @param {number} args.cbk 回调函数id
     * @param {object} args.extra 透传参数
     */
    msgProcess(args){
        let {cmd} = {...args};
        const Store = require('../database/store');
        const store = new Store(this.uid);
        args.store = store;
        if (cmd >= 100 && cmd < 200) {
            // 用户相关操作
            this.userProcess(args);
        } else if(cmd >= 200 && cmd < 300) {
            // 好友圈相关操作
            this.findProcess(args);
        } else if(cmd >= 300 && cmd < 400) {
            // 好友相关操作
            this.friendProcess(args);
        } else if(cmd >= 400 && cmd < 500) {
            // 聊天相关操作
            this.chatProcess(args);
        }
    }
    /**
     * 用户相关操作
     * @param {object} args 
     * @param {number} args.cmd 操作码
     * @param {object} args.data 参数
     * @param {number} args.cbk 回调函数id
     * @param {object} args.extra 透传参数
     * @param {object} args.store 操作数据的对象
     */
    userProcess(args){
        let {cmd, data, cbk, extra, store} = {...args};
        switch (cmd) {
            case 100:
                // 获取用户信息
                store.get_info().then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 101:
                // 设置用户信息
                store.set_info(data).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((err) => {
                    this.opFail(err, cbk, extra);
                });
            case 102:
                // 搜索用户
                store.search(data.key).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
            default:
                break;
        }
    }
    /**
     * 好友圈相关操作
     * @param {object} args 
     * @param {number} args.cmd 操作码
     * @param {object} args.data 参数
     * @param {number} args.cbk 回调函数id
     * @param {object} args.store 操作数据的对象
     * @param {object} args.extra 透传参数
     */
    findProcess(args){
        let {cmd, data, cbk, extra, store} = {...args};
        switch (cmd) {
            case 200:
                // 发布好友圈
                store.put_up(data).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 201:
                // 获取我能看到的好友圈
                store.get_circle(data.page).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 202:
                // 删除
                store.del_my_release(data.findId).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 203:
                // 点赞
                store.click_like(data.findId).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 204: 
                // 取消点赞
                store.click_dis_like(data.findId).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 205:
                // 发表评论
                store.comment(data).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 207: 
                // 获取点赞列表
                store.get_likes_list(data.findId).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 208: 
                // 获取评论列表
                store.get_comments_list(data.findId).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 209: 
                // 获取我发表的所有好友圈
                store.get_my_release(data.page).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            default:
                break;
        }
    }
    /**
     * 好友相关操作
     * @param {object} args 
     * @param {number} args.cmd 操作码
     * @param {object} args.data 参数
     * @param {number} args.cbk 回调函数id
     * @param {object} args.store 操作数据的对象
     * @param {object} args.extra 透传参数
     */
    friendProcess(args){
        let {cmd, data, cbk, extra, store} = {...args};
        switch (cmd) {
            case 300:
                store.get_user_info_by_uid(data.uid).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 301:
                store.get_friend_list().then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 302:
                // 发送好友申请
                store.add_friend_pre(data.uid).then((dt) => {
                    // 推送给对应的申请对象
                    this.opSuccess(dt, cbk, extra);
                    this.push(102, 0, 0, '收到新的好友申请', [data.uid]);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 303:
                store.del_friend(data.uid).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 304: 
                store.focus(data.uid).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 305:
                store.dis_focus(data.uid).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 306: 
                // 获取好友验证列表
                store.get_check_list().then((data) =>{
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 307: 
                // 好友验证
                store.friend_check(data).then((dt) => {
                    if (data.isAgree == 1) {
                        store.add_friend(data.uid).then((data) => {
                            this.opSuccess(data, cbk, extra);
                        });
                    }
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 308:
                // 获取粉丝
                store.get_follows(data.uid).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 309:
                // 关注
                store.get_focus_list(data.uid).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 310: 
                // 获取发表的好友圈
                store.get_release(data.uid).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            default:
                break;
        }
    }
    /**
     * 聊天相关操作
     * @param {object} args 
     * @param {number} args.cmd 操作码
     * @param {object} args.data 参数
     * @param {number} args.cbk 回调函数id
     * @param {object} args.store 操作数据的对象
     * @param {object} args.extra 透传参数
     */
    chatProcess(args){
        let {cmd, data, cbk, extra, store} = {...args};
        switch (cmd) {
            case 400:
                // 创建聊天室
                store.create_chat_room(data).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 401:
                // 获取聊天室信息
                store.get_room_info(data.roomId).then((data) => {
                    this.opSuccess(data, cbk, extra);
                }).catch((msg) => {
                    this.opFail(msg, cbk, extra);
                });
                break;
            case 402:
                // 聊天室内发消息
                let {roomId, msg} = {...data};
                store.get_room_info(roomId).then((data) => {
                    this.push(103, 0, 0, msg, data.data.users);
                });
            default:
                break;
        }
    }
    /**
     * 操作成功
     * @param {object} data 数据
     * @param {number} cbk 回调函数id
     * @param {object} extra 透传参数
     */
    opSuccess(data, cbk, extra){
        const {resFormat} = require('../core/tools');
        this.conn.sendText(resFormat({
            status: 0,
            data: data.data,
            cbk,
            extra: data.extra
        }));
    }
    /**
     * 操作失败
     * @param {string} msg 提示信息 
     * @param {number} cbk 回调函数id
     * @param {object} extra 透传参数
     */
    opFail(msg, cbk, extra){
        const {resFormat} = require('../core/tools');
        this.conn.sendText(resFormat({
            status: -1,
            data: msg,
            cbk
        }));
    }
    /**
     * 消息推送
     * @param {number} model 
     * @param {number} type 
     * @param {number} id 
     * @param {object} data 
     * @param {Array} uidList 
     */
    push(model, type, id, data, uidList){
        const {pushFormat} = require('../core/tools');
        let onlines = this.getOnlines();
        for (let iterator of uidList) {
            if (onlines[iterator]) {
                onlines[iterator].sendText(
                    pushFormat({
                        model, 
                        type,
                        id, 
                        data
                    }));
            }
        }
    }
 }

 module.exports = Socket;