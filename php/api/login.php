<?php
    // 引入数据库连接 
    include_once('../common/conn.php');
    // 引入返回特定格式响应的函数
    include_once('../common/respond.php');
    // 引入token的生成方法
    include_once('../common/token.php');
    // 引入redis
    include_once('../common/redis.php');
    // 接收post传参
    $tel = $_POST['tel'] or '';
    $wxid = $_POST['wxid'] or '';

    // 构造sql语句
    $sql = "select * from user where tel = '$tel' or wxid = '$wxid'";
    // 查询
    $res = mysqli_query($conn, $sql);
    // 用于存放要返回的数据
    $arr = [];
    if ($rs = mysqli_fetch_assoc($res)) {
        // 老用户，返回用户信息
        $arr['benew'] = 0;
    } else {
        // 新用户，注册并返回用户信息
        if(!$tel){
            // 传入的是wxid（微信登录）
            $s = "insert into user(wxid) values('$wxid');";
        }else{
            // 传入的是tel（手机号登录）
            $s = "insert into user(tel) values($tel);";
        }
        // 新用户，返回用户信息
        $r=mysqli_query($conn, $s);
        // 判断执行结果，根据结果返回数据
        if ($r) {
            // 插入成功查询用户
            $res = mysqli_query($conn, $sql);
            $rs = mysqli_fetch_assoc($res);
        }else{
            // 插入失败
            respond(4000, null, "insert fail");
            return;
        }
        $arr['benew'] = 1;
    }

    $arr['user'] = $rs;
    // 秘钥
    $key = 'www.bluesyoung-web.com';
    // 生成token
    $token = makeToken($key);
    // 使用redis存储token
    $redis -> set("token", $token);
    $arr['user']['token'] = $token;

    respond(2000, $arr, "welcom");
?>