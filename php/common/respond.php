<?php
    /**
     * @param $status 状态码
     * @param $data (js的对象，PHP的索引数组)
     * @param $msg (返回的提示信息)
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