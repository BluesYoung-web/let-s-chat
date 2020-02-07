<?php
    /**
     * 用于主动推送websocket消息
     * @author 张扬
     * @copyright http://github.com/BluesYoung-web
     */

    /**
     * 用于socket推送消息的处理函数
     * @param number $model 首层
     * @param number $type 二层
     * @param number $id 三层
     * @param array $data 推送的数据
     * @return string 返回json编码后的数据
     */
    function pushFormat($model, $type, $id, $data){
        if(!$data){
            $data = "{}";
        }
        $rs = [];
        $rs['model'] = $model or 0;
        $rs['type'] = $type or 0;
        $rs['id'] = $id or 0;
        $rs['data'] = $data;
        return json_encode($rs);
    }
?>