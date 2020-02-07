<?php
    /**
     * 用于主动推送websocket消息
     * @author 张扬
     * @copyright http://github.com/BluesYoung-web
     */

    /**
     * 用于socket主动推送消息的处理函数
     * @param number $model 首层
     * @param number $type 二层
     * @param number $id 三层
     * @param array $data 推送的数据
     * @return string 返回json编码后的数据
     */
    function pushFormat($model, $type, $id, $data){
        $data = $data === null ? '{}' : $data;
        $model = $model === null ? 0 : $model;
        $type = $type === null ? 0 : $type;
        $id = $id === null ? 0 : $id;
        $rs = [];
        $rs['model'] = $model;
        $rs['type'] = $type;
        $rs['id'] = $id;
        $rs['data'] = $data;
        return json_encode($rs);
    }
    
    /**
     * 用于socket响应推送消息的处理函数
     * @param number $status 状态码 0 -> 成功, -1 -> 失败
     * @param array $data 响应的数据
     * @param number $cbk 回调函数id
     * @param array $extra 透传参数
     * @return string 返回json编码后的数据
     */
    function resFormat($status, $data, $cbk, $extra){
        $data = $data === null ? '{}' : $data;
        $status = $status === null ? 0 : $status;
        $cbk = $cbk === null ? 0 : $cbk;
        $extra = $extra === null ? '{}' : $extra;
        $rs = [];
        $rs['status'] = $status or 0;
        $rs['data'] = $data;
        $rs['cbk'] = $cbk;
        $rs['extra'] = $extra;
        return json_encode($rs);
    }
?>