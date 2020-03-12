/**
 * 操作MongoDB数据库的类
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */

class MyMongo{
    /**
     * 构造函数
     * @param {object} args 
     * @param {object} args.cname 集合名
     * @param {object} args.struct 骨架
     */
    constructor(args){
        let {cname, struct} = {...args};
        this.cname = cname;
        this.struct = struct;
        this.init();

    }
    /**
     * 初始化：创建骨架、模型、实体
     */
    init(){
        const mongoose = require('mongoose');
        /**
         * 定义骨架
         */
        this.schema = new mongoose.Schema(this.struct);
        /**
         * 根据骨架定义模型
         */
        this.model = mongoose.model(this.cname, this.schema, this.cname);
        /**
         * 根据模型创建实体
         */
        this.entity = new this.model();
    }
    /**
     * 查询
     * @param {object} condition 查询条件对象
     */
    find(condition){
        return new Promise((resolve, reject) => {
            this.model.find(condition).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data); 
                }
            });
        });
    }
    /**
     * 新增
     */
    insert(args){

    }
}

/**
 * 暴露
 */
module.exports = MyMongo;