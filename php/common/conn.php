<?php
    header("Content-Type:text/html; charset=utf-8");
    date_default_timezone_set('PRC');
    $conn = mysqli_connect('localhost', 'root', '123456', 'lailiao') or die('数据库连接失败');
                        //连接名，用户名，密码，数据库名
    $charset = 'set names utf8';//设置传输编码utf-8
    mysqli_query($conn, $charset);
?>