/**
 * 操作redis
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

class MyRedis{
    /**
     * 操作redis的类
     * @param {object} client 
     */
    constructor(client){
        this.client = client;
    }
    /**
     * 获取键名对应的键值
     * @param {string} key 
     */
    get(key){
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        }).catch((err) => {
            throw err;
        });
    }
    /**
     * 设置键值对
     * @param {string} key 
     * @param {string} value 
     */
    set(key, value){
        return new Promise((resolve, reject) => {
            this.client.set(key, value, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }).catch((err) => {
            throw err;
        });
    }
    /**
     * 删除对应键的值
     * @param {string} key 
     */
    del(key){
        return new Promise((resolve, reject) => {
            this.client.del(key, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }).catch((err) => {
            throw err;
        });
    }
}

/**
 * 暴露
 */
module.exports = MyRedis;