// 登录状态管理
import Vue from 'vue';
import Vuex from 'vuex';
// 告诉 vue “使用” vuex
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {	//全局变量定义处
		token:'',
		// 屏幕可用高度
		windowHeight:'',
		// PHP服务器地址
		serverUrl:'http://192.168.10.136',
		// websocket服务器地址
		websocketUrl:'ws://192.168.10.136:8848',
		//对话内容嵌入消息列表
		conversationMessageList:[
			// {
			// 	imgUrl:'/static/img/finds_01.jpg',
			// 	username:"贾榜",
			// 	time:"消息接收时间",
			// 	content:"如果暴力不是为了杀戮那将毫无意义",
			// 	right: 0,
			// 	msgNum:2,
			// 	account:11111111,
			// 	conversation:[]
			// },
		],
		// 用户信息
        userInfo: {
			name:'',
			motto:'',
			account:'',
			avatarUrl:'',
			// 是否微信登录
			wxId:'',
			phone:''
		},
		// 临时用户信息(搜索)
		tempInfo: {
			name:'',
			motto:'',
			account:'',
			avatarUrl:'',
			wxId:'',
			phone:''
		},
		// 好友列表
		myFriends:[
					// [],...27
				],
		// 好友圈
		findLists:[ 
					// {
					// 	id:1,
					// 	userId: 12345678,
					// 	avatar: "/static/img/finds_01.jpg",
					// 	name: "小美",
					// 	time: 1576199585544,
					// 	showTime:new Date(1576199585544).toTimeString().substr(0, 5),
					// 	dynamicImg: "/static/img/finds_01.jpg", //发布的动态图片
					// 	likesNum: 9, //点赞数
					// 	commentsNum: 15, //评论数
					// 	likeAction: false, //是否给他点赞
					// },
				],
		// 我发布的好友圈
		myFindLists:[],
		// 赞我的人
		likeMe:[
			// {
				// 	name:"",
				// 	avatar:"",
				//  userId:''
			// }
		],
		// 关注我的人
		followMe:[
			// {
			// 	avatar:'',
			// 	name:'',
			// 	isFocus:0
			// }
		],
		socketTask:null,
		is_open_socket:false
    },
    mutations: {
		// 设置屏幕高度
		setWindowHeght(state,height){
			state.windowHeight=height;
		},
		// 设置用户信息
		setInfo(state,obj){
			for (let s in obj) {
				state.userInfo[s] = obj[s];
				console.log("存入了"+s+":"+obj[s]);
			}
		},
		// 设置搜索到的用户信息
		setInfoTemp(state,obj){
			for (let s in obj) {
				state.tempInfo[s] = obj[s];
				console.log("临时存入了"+s+":"+obj[s]);
			}
		},
		// 添加好友
		addFriend(state,obj){
			let uid=[];
			for (let i in state.myFriends) {
				let tp1=state.myFriends[i];
				if(tp1.length>0){
					for (let j in tp1) {
						uid.push(j.account);
					}
				}
			}
			// 如果好友已存在
			if (uid.includes(obj.account)) {
				console.log("已经是好友了");
			} else{
				// 排序
				const searchWord=['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
							'N', 'O', 'P', 'Q', 'R', 'S', 'T','U', 'V', 'W', 'X', 'Y', 'Z', '#'];
				let i = searchWord.indexOf(obj.key);
				state.myFriends[i].push(obj);
				console.log("添加了好友"+obj.name);
			}
		},
		// 删除好友
		deleteFriend(state,obj){
			let uid=[];
			for (let i in state.myFriends) {
				let tp1=state.myFriends[i];
				if(tp1.length>0){
					for (let j in tp1) {
						uid.push(j.account);
					}
				}
			}
			for (let i in uid) {
				// 高阶函数删除数组项
				state.myFriends=state.myFriends.filter((item)=>{
					if(item.length==0){
						return true;
					}else{
						for (let j in item) {
							if(item[j].account==obj.account){
								console.log("删除了好友"+obj.name);
								return false;
							}else{
								return true;
							}
						}
					}
				});
			}
		},
		// 从缓存列表加载好友
		addFriendFromCache(state,lists){
			// 深拷贝
			state.myFriends=JSON.parse(JSON.stringify(lists));
		},
		// 清空好友列表
		deleteAllFriend(state){
			state.myFriends.length=0;
			console.log("好友列表已清空");
		},
		// 暂存好友圈信息
		addFinds(state,lists){
			// 深拷贝
			state.findLists=JSON.parse(JSON.stringify(lists));
			console.log("好友圈信息已暂存state");
		},
		// 暂存我发布的好友圈
		addMyFinds(state,lists){
			// state.myFindLists=JSON.parse(JSON.stringify(lists));
			state.myFindLists=lists;
			console.log("我的好友圈信息已暂存state");
		},
		// 更新好友圈信息
		updateFinds(state,obj){
			let {id,commentsNum,likesNum}=obj;
			for (let i in state.findLists) {
				if(state.findLists[i].id==id){
					console.log(commentsNum);
					state.findLists[i].commentsNum=commentsNum;
					state.findLists[i].likesNum=likesNum;
				}
			}
		},
		// 暂存赞我的人
		addLikes(state,lists){
			state.likeMe=lists;
			console.log("赞我的人的信息已暂存");
		},
		// 暂存关注我的人
		addFocus(state,lists){
			state.followMe=lists;
			console.log("关注我的人的信息已暂存");
		},
		// 添加消息列表
		addMessageList(state,msg){
			for (let i in state.conversationMessageList) {
				// 如果已有消息项则合并
				if(state.conversationMessageList[i].account==msg.account){
					state.conversationMessageList[i].msgNum+=msg.msgNum;
					state.conversationMessageList[i].time=msg.time;
					state.conversationMessageList[i].content=msg.content;
					state.conversationMessageList[i].conversation.push(msg.conversation[0]);
					console.log(JSON.stringify(state.conversationMessageList[i].conversation));
					return;
				}
			}
			// 如果没有消息项则新增
			state.conversationMessageList.push(msg);
			console.log(JSON.stringify(state.conversationMessageList));
		},
		// 单方面发信息
		addMessageListFirst(state,msg){
		    for (let i in state.conversationMessageList) {
		    	// 如果已有消息项则合并
		    	if(state.conversationMessageList[i].account==msg.account){
		    		state.conversationMessageList[i].time=msg.time;
		    		state.conversationMessageList[i].content=msg.content;
		    		//内容push
		    		state.conversationMessageList[i].conversation.push(msg);
					return;
		    	}
		    }
			state.conversationMessageList.push(msg);
		},
		// 改变消息列表的content
		changeContent(state,obj){
			for (let i in state.conversationMessageList) {
				if(state.conversationMessageList[i].account==obj.account){
					state.conversationMessageList[i].content=obj.content;
					state.conversationMessageList[i].time=obj.time;
				}
			}
		},
		// 添加会话页面消息
		addConversationMessage(state,obj){
			for (let i in state.conversationMessageList) {
				if(state.conversationMessageList[i].account==obj.fid){
					state.conversationMessageList[i].conversation=obj.messages;
					return;
				}
			}
		},
		// 改变socket标志
		changeSocketFlag(state,if_opened){
			state.is_open_socket=if_opened;
		},
		// 存储socketTask
		addSocketTask(state,socket){
			state.socketTask=socket;
		},
		// 删除消息数
		clearMsgNum(state,fid){
			for (let i in state.conversationMessageList) {
				if(state.conversationMessageList[i].account==fid){
					state.conversationMessageList[i].msgNum=0;
				}
			}
		},
		// 从缓存添加消息
		addConversationFromCache(state,lists){
			// 深拷贝
			state.conversationMessageList=JSON.parse(JSON.stringify(lists));
		},
		// 清空聊天记录
		deleteConversationMessage(state){
			state.conversationMessageList.length=0;
		},
		//添加/更新token 
		addToken(state,tk){
			state.token=tk;
		},
		// 删除token
		deleteToken(state){
			state.token='';
		}
    },
	getters:{
		serverUrl:(state)=>state.serverUrl,
		websocketUrl:(state)=>state.websocketUrl,
		userInfo:(state)=>state.userInfo,
		tempInfo:(state)=>state.tempInfo
	}
})

export default store
