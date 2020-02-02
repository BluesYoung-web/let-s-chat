// 事件处理模块
let events_model = {};
let events_model_type = {};
let events_model_type_id = {};

// 注册监听
const register = function(...arg){
	let on_event = arg.pop();
	let model = arg.shift();
	let type = arg.shift();
	let id = arg.shift();
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
// 移除监听
const unregister = function(...arg){
	let on_event = arg.pop();
	let model = arg.shift();
	let type = arg.shift();
	let id = arg.shift();
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
// 事件分发
const dispatch = function(...arg){
	let data = arg.pop();
	let model = arg.shift();
	let type = arg.shift();
	let id = arg.shift();
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
// 广播
const broadcast = function(...arg){
	let data = arg.pop();
	let model = arg.shift();
	let type = arg.shift();
	let id = arg.shift();
	
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