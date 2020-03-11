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
        const {resFormat} = require('../core/tools');
        switch (cmd) {
            case 100:
                // 获取用户信息
                store.get_info().then((data) => {
                    this.conn.sendText(resFormat({
                        status: 0,
                        data: data.data,
                        cbk,
                        extra: data.extra
                    }));
                }).catch((msg) => {
                    this.conn.sendText(resFormat({
                        status: -1,
                        data: mag,
                        cbk
                    }));
                });
                break;
            case 101:
                // 设置用户信息
                store.set_info(data).then((msg) => {
                    this.conn.sendText(resFormat({
                        status: 0,
                        data: msg,
                        cbk
                    }));
                }).catch((err) => {
                    this.conn.sendText(resFormat({
                        status: -1,
                        data: err,
                        cbk
                    }));
                });
            case 102:
                // 搜索用户
                store.search(data.key).then((data) => {
                    this.conn.sendText(resFormat({
                        status: 0,
                        data: data.data,
                        cbk,
                        extra: data.extra
                    }));
                }).catch((msg) => {
                    this.conn.sendText(resFormat({
                        status: -1,
                        data: mag,
                        cbk
                    }));
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

    }


 }

 module.exports = Socket;