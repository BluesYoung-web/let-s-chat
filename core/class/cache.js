class Cache{
    constructor(name, prefix){
        this.prefix = `${name}.${prefix}`;
		this.data = {};
		this.uid = '';
    }
    get(key){
        // 首先从全局变量获取
        let data = this.data[key] || false;
        if (data === false) {
            // 全局变量中没有则从缓存获取
            uni.getStorage({
				key : `${this.prefix}.${this.uid}.${key}`,
				success : (res) => {
                    data = JSON.parse(res.data);
                    // 更新data
					this.data[key] = data;
				},
				fail : (err) => {
					data = null;
				}
			});
        } 
        return data;
    }
    set(key, value){
		let rs = true;
		if(key.includes('account')){
			this.uid = value.uid;
			console.log("设置账户信息",this.uid);
		}
		uni.setStorage({
			key: `${this.prefix}.${this.uid}.${key}`,
			data: JSON.stringify(value),
			success: (res) => {
				// 更新data
				this.data[key] = value;
			},
			fail: (err) => {
				rs = false;
			}
		});
		return rs;
    }
    del(key){
        let rs = true;
		uni.removeStorage({
			key: `${this.prefix}.${this.uid}.${key}`,
			success: (res) => {
				// 更新data
				delete this.data[key];
			},
			fail: (err) => {
				rs = false;
			}
		})
		return rs;
    }
}

export default Cache;