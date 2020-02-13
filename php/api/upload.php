<?php
    include_once('../common/respond.php');
    $f = $_GET['fileType'];
    // var_dump($_FILES);
    // 获取上传文件对应的字典（对象）
    $fileInfo = $_FILES[$f.''];
    // 上传出错
    if ($fileInfo['error'] > 0) {
        respond(-1, $fileInfo['error'], "文件上传出错");
    } else {
        // 获取上传文件的名称
        $fileName = $fileInfo["name"];
        
        // 获取上传文件保存的临时路径
        $filePath = $fileInfo["tmp_name"];

        // 将文件存到服务器
        move_uploaded_file($filePath, "../".$f."/".$fileName);
        // $url = "http://117.78.0.214/".$f."/".$fileName;
        $url = "http://www.bluesyoung-web.com/".$f."/".$fileName;
        
        $arr = [];
        $arr['url'] = $url;

        respond(0, $arr, "文件上传成功");
    }
?>