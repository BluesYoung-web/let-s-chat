<?php
    /**
     * 用于http请求返回
     * @author 张扬
     * @copyright http://github.com/BluesYoung-web
     */

    /**
     * 用于http请求返回的函数
     * @param number $status 状态码 0 -> 成功，-1 -> 失败
     * @param array $data (js的对象，PHP的索引数组)
     * @param string $msg (返回的提示信息)
     */
    function respond($status, $data, $msg){
        if(!$data){
            $data = "{}";
        }
        $rs = [];
        $rs['status'] = $status;
        $rs['data'] = $data;
        $rs['msg'] = $msg;
        echo json_encode($rs);
    }
?>