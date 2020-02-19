<?php
/**
 * 用于管理存储，MySQL与Redis
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */
include_once('sql.php');
class Store{
    /**
     * 存放用户uid
     */
    private $uid;
    /**
     * 存放SQL查询对象
     */
    private $sql;
    /**
     * 存放redis对象
     */
    private $redis;
    /**
     * 构造函数
     * @param number $uid 当前用户的uid
     */
    public function __construct($uid){
        /**
         * 存储uid
         */
        $this -> uid = $uid;
        /**
         * 初始化redis
         */
        $this -> redis = new Redis();
        $this -> redis -> connect('127.0.0.1', 6379);
        $this -> redis -> auth('123456');
        /**
         * 初始化sql
         */
        $this -> sql = new mySql($uid);
    }
    /**
     * 析构函数
     */
    public function __destruct(){
    }
    /**
     * 获取当前用户信息
     */
    public function get_info()
    {
        // 首先从redis获取
        $info = $this -> redis -> get('user_'.$this -> uid.'_info');
        if (! $info) {
            // 如果拿不到，从SQL获取
            $info = $this -> sql -> get_info();
            // 如果拿到了
            if ($info) {
                echo "从mysql获取\n";
                // 写入redis, 数组转字符串
                $this -> redis -> set('user_'.$this -> uid.'_info', json_encode($info));
                // 返回
                return $info;
            } else {
                echo "找不到";
                // 返回null
                return null;
            }
        }else{
            echo "从redis获取\n";
            // 字符串转数组
            return json_decode($info, true);
        }
    }
    /**
     * 设置当前用户信息
     * @param array $arr 包含用户信息的数组
     * @param string $extra 额外的消息
     */
    public function set_info($arr, $extra){
        if ($extra == 'changePhone') {
            // 修改手机号
            $res = $this -> change_tel($arr['tel']);
        } else {
            // 修改常规信息
            // 首先写入mysql
            $res = $this -> sql -> set_info($arr);
            // 如果写入成功
            if($res){
                // 更新redis，数组转字符串
                $this -> redis -> set('user_'.$this -> uid.'_info', json_encode($arr));
            }
        }
        return $res;
    }
    /**
     * 修改手机号
     * @param string $tel 新的手机号
     */
    public function change_tel($tel){
        // 首先写入mysql
        $res = $this -> sql -> change_tel($tel);
        // 如果写入成功
        if($res){
            // 获取用户信息
            $arr = $this -> redis -> get('user_'.$this -> uid.'_info');
            $arr = json_decode($arr, true);
            // 更新redis，数组转字符串
            $arr['tel'] = $tel;
            $this -> redis -> set('user_'.$this -> uid.'_info', json_encode($arr));
        }
        return $res;
    }
}
?>