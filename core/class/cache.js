class Cache{
    constructor(prefix){
        this.prefix = prefix;
        this.data = {};
    }
    get(key){
        // 首先从全局变量获取
        let data = this.data[key] || false;
        if (data === false) {
            // 全局变量中没有则从缓存获取
            uni.getStorage({
				key : `${this.prefix}.${key}`,
				success : (res) => {
                    value = JSON.parse(res.data);
                    // 更新data
					this.data[key] = value;
				},
				fail : (err) => {
					value = null;
				}
			});
        } 
        return value;
    }
    set(key, value){
        let rs = true;
		uni.setStorage({
			key: `${this.prefix}.${key}`,
			data: JSON.stringify(value),
			success: (res) => {
				// 更新data
				this.data[key] = value;
			},
			fail: (err) => {
				rs = false;
			}
		})
		return rs;
    }
    del(key){
        let rs = true;
		uni.removeStorage({
			key: `${this.prefix}.${key}`,
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