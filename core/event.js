/**
 * 事件处理模块
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

/**
 * 用于存放首层监听函数
 */
let events_model = {};
/**
 * 用于存放二层监听函数
 */
let events_model_type = {};
/**
 * 用于存放三层监听函数
 */
let events_model_type_id = {};

/**
 * 注册事件监听
 * @param {object} args
 * @param {number} args.model - 首层监听
 * @param {number} args.type - 二层监听
 * @param {number} args.id - 三层监听
 * @param {function} args.on_event - 监听的回调函数
 */
const register = function(args){
	let {model, type, id, on_event} = {...args};
	
	if(model && type && id){
		if(!events_model_type_id[model]){
			events_model_type_id[model] = [];
		}
		if(!events_model_type_id[model][type]){
			events_model_type_id[model][type] = [];
		}
		if(!events_model_type_id[model][type][id]){
			events_model_type_id[model][type][id] = [];
		}
		events_model_type_id[model][type][id].push(on_event);
	}else if(model && type){
		if(!events_model_type[model]){
			events_model_type[model] = [];
		}
		if(!events_model_type[model][type]){
			events_model_type[model][type] = [];
		}
		events_model_type[model][type].push(on_event);
	}else if(model){
		if(!events_model[model]){
			events_model[model] = [];
		}
		events_model[model].push(on_event);
	}
}
/**
 * 移除事件监听
 * @param {object} args
 * @param {number} args.model - 首层监听
 * @param {number} args.type - 二层监听
 * @param {number} args.id - 三层监听
 * @param {function} args.on_event - 监听的回调函数
 */
const unregister = function(args){
	let {model, type, id, on_event} = {...args};

	if(model && type && id){
		if(events_model_type_id[model][type][id]){
			events_model_type_id[model][type][id].splice(events_model_type_id[model][type][id].indexOf(on_event),1);
		}else{
			return;
		}
	}else if(model && type){
		if(events_model_type_id[model][type]){
			events_model_type_id[model][type].splice(events_model_type_id[model][type].indexOf(on_event),1);
		}else{
			return;
		}
	}else if(model){
		if(events_model_type_id[model]){
			events_model_type_id[model].splice(events_model_type_id[model].indexOf(on_event),1);
		}else{
			return;
		}
	}else{
		return;
	}
}
/**
 * 事件分发(触发，自动调用对应的监听的回调函数)
 * @param {object} args
 * @param {number} args.model - 首层监听
 * @param {number} args.type - 二层监听
 * @param {number} args.id - 三层监听
 * @param {object} args.data - 传入的数据
 */
const dispatch = function(args){
	let {model, type, id, data} = {...args};

	if(events_model_type_id[model] && events_model_type_id[model][type] && events_model_type_id[model][type][id]){
		for (let on_event in events_model_type_id[model][type][id]) {
			events_model_type_id[model][type][id][on_event](model,type,id,data);
		}
	}
	
	if(events_model_type[model] && events_model_type[model][type]){
		for (let on_event in events_model_type[model][type]) {
			events_model_type[model][type][on_event](model,type,id,data);
		}
	}
	
	if(events_model[model]){
		for (let on_event in events_model[model]) {
			events_model[model][on_event](model,type,id,data);
		}
	}
}
/**
 * 广播(没有对应的事件监听)
 * @param {object} args
 * @param {number} args.model - 首层监听
 * @param {number} args.type - 二层监听
 * @param {number} args.id - 三层监听
 * @param {object} args.data - 传入的数据
 */
const broadcast = function(args){
	let {model, type, id, data} = {...args};
	
	if(model){
		for (let on_event in events_model) {
			events_model[model][on_event](model, type, id, data);
		}
	}
	if(model && type){
		for (let on_event in events_model) {
			events_model[model][type][on_event](model, type, id, data);
		}
	}
	if(model && type && id){
		for (let on_event in events_model) {
			events_model[model][type][id][on_event](model, type, id, data);
		}
	}
}

export default {
	register,
	unregister,
	dispatch,
	broadcast
}