<?php
    $f=$_GET['fileType'];
    // 获取上传文件对应的字典（对象）
    $fileInfo = $_FILES[$f.''];
    // 获取上传文件的名称
    $fileName = $fileInfo["name"];
    
    // 获取上传文件保存的临时路径
    $filePath = $fileInfo["tmp_name"];

    // 将图片存到服务器
    move_uploaded_file($filePath, "../".$f."/".$fileName);
    // $new_avatar="http://117.78.0.214/".$f."/".$fileName;
    $new_avatar="http://127.0.0.1/".$f."/".$fileName;
    echo $new_avatar;
?>