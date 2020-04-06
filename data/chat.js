/**
 * 聊天模块 
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
 * 模块id
 */
const model = 103;
/**
 * 监听聊天室收到消息的事件
 */
event.register({
    model,
    type: 0,
    id: 0,
    on_event: (model, type, id, dt) => {
        let roomId = dt.roomId;
        let msg = dt.msg;
        data.user.get_info({
            success: (res) => {
                if (msg.type == 3 || res.uid == msg.uid) {
                    // 系统消息或自己发的消息
                    msg.user = 'myself';
                } else if(msg.uid) {
                    // 别人发的消息
                    msg.user = 'others';
                    uni.vibrateLong({
                        success: function () {
                            console.log('振动。。。。。。。');
                        }
                    });
                }
                // 添加到消息列表
                add_to_room_list({
                    roomId,
                    userUid: res.uid,
                    // 以防万一
                    item: JSON.parse(JSON.stringify(msg)),
                    success: () => {
                        console.log('添加到消息列表成功');
                        // 添加到聊天记录
                        add_to_chat_log_list({
                            roomId,
                            // 修复聊天记录首条消息自动变化的bug
                            item: JSON.parse(JSON.stringify(msg)),
                            success: () => {
                                console.log('添加到聊天记录成功');
                                // 消息滚动
                                uni.$emit(roomId+'.onMsg');
                            }
                        });
                    },
                    fail: (code, err) => {
                        console.log(code, err);
                    }
                });
            }
        });
    }
});
/**
 * 指令集
 */
const cmds = {
    create_room: 400,
    get_room_info: 401,
    send_msg: 402,
    invite: 403,
    quit: 404,
    set_room_info: 405
}
/**
 * 根据聊天室id获取聊天室详细信息
 * @param {object} args 
 * @param {number} args.roomId 聊天室id 
 * @param {Function} args.success 
 * @param {Function} args.fail 
 */
const get_room_info = function(args){
    let {roomId, success, fail} = {...args};
    net.send({
        cmd: cmds.get_room_info,
        data: {
            roomId
        },
        success,
        fail
    });
}
/**
 * 发消息
 * @param {object} args
 * @param {number} args.roomId 聊天室id
 * @param {object} args.msg 要发送的消息
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const send_msg = function(args){
    let {roomId, msg, success, fail} = {...args};
    net.send({
        cmd: cmds.send_msg,
        data: {
            roomId, 
            msg
        },
        success, 
        fail
    });
}
/**
 * 获取消息列表
 * @param {Function} success
 */
const get_room_list = function(success){
    data.user.get_info({
        success: (res) =>{
            let uid = res.uid;
            store.get({
                key: `${uid}.chatRoom`,
                success: (res) => {
                    if(res === null){
                        res = [];
                        // 将消息列表初始化为空数组,解决消息延迟的bug
                        set_room_list({
                            roomList: res,
                            success: () => {
                                console.log("消息列表初始化为空数组");
                                success && success(res);
                            },
                            fail: () => {
                                console.log("消息列表初始化失败");
                            }
                        });
                    }else{
                        success && success(res);
                    }
                }
            });
        }
    });
}
/**
 * 设置消息列表
 * @param {object} args 
 * @param {Array} args.roomList 聊天室列表
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const set_room_list = function(args){
    let {roomList, success, fail} = {...args};
    data.user.get_info({
        success: (res) =>{
            let uid = res.uid;
            store.set({
                key: `${uid}.chatRoom`,
                data: roomList,
                success,
                fail
            });
        }
    });
}
/**
 * 添加到消息列表 
 * @param {object} args 
 * @param {number} args.roomId 聊天室id
 * @param {number} args.userUid 当前用户uid
 * @param {object} args.item 要展示的内容
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const add_to_room_list = function(args) {
    let {roomId, userUid, item, success, fail} = {...args};
    get_room_list((res) => {
        if (res && res.length == 0) {
            // 列表为空，直接push
            add_to_room_list_process({
                item: JSON.parse(JSON.stringify(item)),
                roomId,
                userUid,
                res,
                success,
                fail
            });
        } else {
            let tp1 = '[语音消息]';
            let tp2 = '[图片消息]';
            let tp3 = '[系统消息]';
            for (let i of res) {
                if (i.roomId == roomId) {
                    // 已存在，更新
                    i.ot = item.ot;
                    i.msgNum += 1;
                    switch (item.type) {
                        case 0:
                            i.content = item.content;
                            break;
                        case 1:
                            i.content = tp1;
                            break;
                        case 2:
                            i.content = tp2;
                            break;
                        case 3:
                            i.content = tp3;
                            break;
                        default:
                            break;
                    }
                    set_room_list({
                        roomId,
                        roomList: res,
                        success,
                        fail
                    });
                    return;
                }
            }
            // 不存在，新增
            add_to_room_list_process({
                item: JSON.parse(JSON.stringify(item)),
                roomId,
                userUid,
                res,
                success,
                fail
            });
        }
    });
}
/**
 * 处理子函数
 * @param {object} args 
 * @param {object} args.item 要展示的内容
 * @param {number} args.roomId 聊天室id
 * @param {number} args.userUid 当前用户uid
 * @param {object} args.res 消息列表
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const add_to_room_list_process = function(args){
    let tp1 = '[语音消息]';
    let tp2 = '[图片消息]';
    let tp3 = '[系统消息]';
    let {item, roomId, userUid, res, success, fail} = {...args};
    item.isTop = 0;
    item.msgNum = 1;
    if (item.type != 0) {
        switch (item.type) {
            case 1:
                item.content = tp1;
                break;
            case 2:
                item.content = tp2;
                break;
            case 3:
                item.content = tp3;
                break;
            default:
                break;
        }
    }
    get_room_info({
        roomId,
        success: (rs) => {
            if (rs.type == 0) {
                // 点对点
                let users = rs.users;
                users = users.filter((i) => i != userUid);
                data.friend.get_info({
                    uid: users[0],
                    success: (tp) => {
                        item.nick = tp.nick;
                        item.imgUrl = tp.avatar;
                        res.push(item);
                        set_room_list({
                            roomId,
                            roomList: res,
                            success,
                            fail
                        });
                    }
                });
            } else {
                // 群聊
                item.nick = rs.title;
                item.imgUrl = rs.avatar;
                res.push(item);
                set_room_list({
                    roomId,
                    roomList: res,
                    success,
                    fail
                });
            }
        }
    });
}
/**
 * 获取聊天记录列表
 * @param {object} args 
 * @param {number} args.roomId 聊天室id
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const get_chat_log_list = function(args){
    let {roomId, success} = {...args};
    data.user.get_info({
        success: (res) =>{
            let uid = res.uid;
            store.get({
                key: `${uid}.chatRoom.${roomId}.chatList`,
                success: (res) => {
                    if (res === null) {
                        res = [];
                        set_chat_log_list({
                            roomId,
                            logList: res,
                            success: () => {
                                console.log('初始化聊天记录列表');
                                success && success(res);
                            },
                            fail: () => {
                                console.log('初始化聊天记录列表失败');
                            }
                        });
                    } else {
                        success && success(res);
                    }
                }
            });
        }
    });
}
/**
 * 设置聊天记录列表
 * @param {object} args 
 * @param {number} args.roomId 聊天室id
 * @param {array} args.logList 聊天记录
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const set_chat_log_list = function(args){
    let {roomId, logList, success, fail} = {...args};
    data.user.get_info({
        success: (res) =>{
            let uid = res.uid;
            store.set({
                key: `${uid}.chatRoom.${roomId}.chatList`,
                data: logList,
                success,
                fail
            });
        }
    });
}
/**
 * 添加到聊天记录
 * @param {object} args 
 * @param {number} args.roomId 聊天室id
 * @param {object} args.item 单条消息
 * @param {Function} args.success
 * @param {Function} args.fail
 */
const add_to_chat_log_list = function(args){
    let {roomId, item, success, fail} = {...args};
    get_chat_log_list({
        roomId,
        success: (res) => {
            console.log(item);
            if (item.type == 3) {
                // 系统消息
                res.push(item);
                set_chat_log_list({
                    roomId,
                    logList: res,
                    success,
                    fail
                });
            } else {
                // 其他普通消息
                data.friend.get_info({
                    uid: item.uid,
                    success: (rs) => {
                        item.imgUrl = rs.avatar;
                        res.push(item);
                        set_chat_log_list({
                            roomId,
                            logList: res,
                            success,
                            fail
                        });
                    }
                });
            }
        }
    });
}
/**
 * 清除聊天记录
 * @param {number} args.roomId 聊天室id
 * @param {Function} args.success
 */
const clear_chat_log_list = function(args){
    let {roomId, success} = {...args};
    if (roomId) {
        // 清除某个聊天记录
        set_chat_log_list({
            roomId,
            logList: [],
            success: () => {
                get_room_list((res) => {
                    res= res.filter((item) => item.roomId != roomId);
                    set_room_list({
                        roomList: res,
                        success
                    });
                });
            }
        });
    } else {
        // 清空聊天记录
        get_room_list((list) => {
            for (const iterator of list) {
                let roomId = iterator.roomId;
                set_chat_log_list({
                    roomId,
                    logList: []
                });
            }
            set_room_list({
                roomList: [],
                success
            });
        })
    }
}
/**
 * 清除未读消息数(标为已读)
 * @param {object} args
 * @param {number} args.roomId 聊天室id
 * @param {Function} args.success
 */
const clear_msg_num = function(args){
    let {roomId, success} = {...args};
    get_room_list((res) => {
        for (const iterator of res) {
            if (iterator.roomId == roomId) {
                iterator.msgNum = 0;
            }
        }
        set_room_list({
            roomList: res,
            success
        });
    });
}
/**
 * 创建群聊
 * @param {object} args 
 * @param {array} args.users 群聊用户数组(不包含当前用户) 
 * @param {Function} args.success
 * @param {Function} args.fail 
 */
const create_room = function(args){
    let {users, success, fail} = {...args};
    net.send({
        cmd: cmds.create_room,
        data: {
            users
        },
        success,
        fail
    });
}
/**
 * 拉人进群
 * @param {object} args 
 * @param {array} args.users 群聊用户数组(不包含当前用户) 
 * @param {Function} args.success
 * @param {Function} args.fail 
 */
const invite = function(args){
    let {roomId, users, success, fail} = {...args};
    net.send({
        cmd: cmds.invite,
        data: {
            users,
            roomId
        },
        success,
        fail
    });
}
/**
 * 退群
 * @param {*} args 
 */
const quit = function(args) {
    let {roomId, users, success, fail} = {...args};
    net.send({
        cmd: cmds.quit,
        data: {
            users,
            roomId
        },
        success,
        fail
    });
}
export default{
    get_room_info,
    send_msg,
    get_room_list,
    set_room_list,
    get_chat_log_list,
    clear_chat_log_list,
    clear_msg_num,
    create_room,
    invite,
    quit
}