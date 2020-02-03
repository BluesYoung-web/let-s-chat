<?php
    /**
     * @param $key 秘钥
     */
    function makeToken($key){
        // 每次调用都不同
        return $token = md5($key.sha1(time()));
    }
?>