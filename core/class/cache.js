/**
 * 用于存储管理的类
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */
class Cache{
	/**
	 * 存储类(暂存与缓存)
	 * @param {string} name - 使用存储的模块名
	 * @param {string} prefix - 存储的前缀
	 */
    constructor(name, prefix){
        this.prefix = `${name}.${prefix}`;
		this.data = {};
	}
	/**
	 * 获取键名对应的键值
	 * @param {string} key - 存储的键名
	 * @return {object} 获取到的键值
	 */
    get(key){
        // 首先从全局变量获取
        let data = this.data[key] || false;
        if (data === false) {
            // 全局变量中没有则从缓存获取
            uni.getStorage({
				key : `${this.prefix}.${key}`,
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
	/**
	 * 存储键值对
	 * @param {string} key 要存储的键名
	 * @param {any} value 要存储的键值
	 * @return {boolean} true/false
	 */
    set(key, value){
		let rs = true;
		if(key.includes('account')){
			this.uid = value.uid;
			console.log("设置账户信息",this.uid);
		}
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
		});
		return rs;
	}
	/**
	 * 删除键名对应的键值
	 * @param {string} key 要删除的存储的键名
	 * @return {boolean} true/false
	 */
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
export default Cache;