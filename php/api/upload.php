<?php
    include_once('../common/redis.php');
    $tk = $redis -> get('token');
    $sign = md5("754433271".$tk);
    echo $tk."\n".$sign;
?>