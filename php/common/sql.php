<?php
/**
 * 用于操作mysql数据库
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */
    class mySql{
        /**
         * sql连接
         */
        private $conn;
        /**
         * 存放当前用户uid
         */
        private $uid;
        /**
         * 构造函数
         * @param number $uid 当前用户的uid
         */
        public function __construct($uid){
            header("Content-Type:text/html; charset=utf-8");
            date_default_timezone_set('PRC');
            $conn = mysqli_connect('localhost', 'root', '123456', 'lailiao') or die('数据库连接失败');
                                //连接名，用户名，密码，数据库名
            $charset = 'set names utf8';//设置传输编码utf-8
            mysqli_query($conn, $charset);
            $this -> conn = $conn;
            $this -> uid = $uid;
        }
        /**
         * 析构函数
         */
        public function __destruct(){
        }
        /**
         * 获取当前用户信息
         */
        public function get_info(){
            $sql = "select * from user where uid = ".$this -> uid;
            $res = mysqli_query($this -> conn, $sql);
            return mysqli_fetch_assoc($res);
        }
        /**
         * 设置当前用户信息
         * @param array $arr 包含用户信息的数组
         */
        public function set_info($arr){
            $name = $arr['name'];
            $motto = $arr['motto'];
            $avatar = $arr['avatar'];
            $sql = "update user set name = '$name', motto = '$motto', avatar = '$avatar' where uid = $uid";
            $res = mysqli_query($this -> conn, $sql);
            return $res;
        }
    }
?>