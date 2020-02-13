<?php
    // include_once('../common/redis.php');
    // $tk = $redis -> get('token') or '';
    // $sign = md5("754433271".$tk);
    // echo $tk."\n".$sign;
    //实例化Redis类
    $redis = new Redis();
    echo !$redis ? ( "1" ): ( "0");
?>