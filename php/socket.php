<?php
/**
 * socket服务器
 * @author 张扬
 * @copyright http://github.com/BluesYoung-web
 */
include_once('./common/store.php');
class SocketServer
{
    /**
     * socket连接池
     */
    private $sockets = []; 
    /**
     * 服务器主机
     */
    private $master;
    /**
     * 握手标志
     */
    private $handshake;
    /**
     * 当前在线用户数组(uid => #R5...)
     */
    private $users = [];
    /**
     * 当前在线用户的存储对象数组(uid => obj)
     */
    private $stores = [];
    /**
     * 读写redis数据库
     */
    private $redis;
    /**
     * 构造函数
     * @param $address 服务器ip地址
     * @param $port 服务器端口号
     */
    public function __construct($address, $port){
        $this -> _redisInit();
        $this -> _socketInit($address, $port);
    }
    /**
     * 析构函数
     */
    public function __destruct(){
        echo "\n谢谢使用，我们下次再见\n";
    }
    /**
     * 启动websocket服务器
     */
    public function run()
    {
        echo "socket服务器运行中\n";
        // 定义写入监听连接池
        $write = null;
        //定义权限接受连接池
        $except = null;
        //定义超时时间
        $time_out = null;
        //启动循环阻塞任务
        while (true) {
            // 复制监听连接池
            $sockets = $this -> sockets;
            //设置同步阻塞监听函数
            $res = socket_select($sockets, $write, $except, $time_out); 
            //监听端口可读后操作
            if ($res === false) {
                // 出错了
                die("socket连接出错");
            } else {
                // 正常
                foreach ($sockets as $socket) {
                    //如果监听到的是原端口
                    if ($socket == $this->master) {
                        // 接收套接字的资源信息，成功返回套接字的信息资源，失败为false
                        $client = socket_accept($socket);
                        if($client === false)
                        {
                            die('failed to accept socket: '.socket_strerror($socket)."\n");
                        }
                        // 改变握手标志
                        $this -> handshake = false;
                        $this->sockets[] = $client; //加入连接池
                        echo "用户".$client."加入了\n";
                    } else {
                        //接收信息
                        $bytes = socket_recv($socket, $buffer, 2048, 0);
                        // 客户端端口连接
                        if ($bytes <= 6) {
                            // 如果客户端断开了，则断开连接(清除记录)
                            $this -> _disConnect($socket);
                            continue;
                        };
                        //处理信息
                        if (!$this -> handshake) {
                            // 协议升级（握手）
                            $this -> _handshake($socket, $buffer);
                        } else {
                            $buffer = $this-> _decode($buffer);
                            //字符串转对象
                            $tp=json_decode(json_decode(json_encode($buffer)),true);
                            $cmd = $tp['cmd'] or null;
                            $data = $tp['data'] or null;
                            $cbk = $tp['cbk'] or null;
                            $extra = $tp['extra'] or null;
                            // 如果未进行过token验证
                            if(!array_search($socket, $this -> users)){
                                $this -> _tokenCheck($socket, $cmd, $data, $cbk, $extra);
                            }else {
                                // 其他正常操作
                                $this -> _Operation($socket, $cmd, $data, $cbk, $extra);
                            }
                        }
                    }
    
                }
            }
            
            
        }
    }

    /**
     * 初始化redis
     */
    private function _redisInit(){
        $this -> redis = new Redis();
        $this -> redis -> connect('127.0.0.1', 6379);
        $this -> redis -> auth('123456');
    }
    /**
     * 初始化socket服务
     * @param string $address 服务器ip地址
     * @param number $port 服务器端口号
     */
    private function _socketInit($address, $port){
        echo "欢迎来到PHP Socket\n";
        // 关闭错误报告
        error_reporting(0);
        // 将程序执行时间设为 ∞
        set_time_limit(0);
        // 打开绝对（隐式）刷送 —— 每次输出调用后有一次刷送操作
        ob_implicit_flush();
        $this -> master = $this -> _connect($address, $port);
        // array_push($this -> sockets, $this -> master); //功能与下面相同
        // 将服务器主机加入监听连接池
        $this -> sockets [] = $this -> master;
        echo '主机：'.$this -> sockets[0]."\n";
    }
    /**
     * 创建socket连接
     * @param string $address 服务器ip地址
     * @param number $port 服务器端口号
     * @return resource $master 套接字
     */
    private function _connect($address, $port)
    {
        // 创建并返回一个套接字(通讯节点) 使用IPV4协议，流式套接字，TCP协议
        $master = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)
        // 创建失败
        or die("socket_create() failed: reason: " . socket_strerror(socket_last_error()) . "\n");
        // 给套接字绑定名字
        socket_bind($master, $address, $port)
        // 绑定失败
        or die("socket_bind() failed: reason: " . socket_strerror(socket_last_error($master)) . "\n");
        // 监听连接事件(进程转服务器，使其可以接受其他进程的连接) 套接字，连接队列长度
        socket_listen($master, 10)
        // 监听失败
        or die("socket_listen() failed: reason: " . socket_strerror(socket_last_error($master)) . "\n");
        // 返回套接字
        return $master;
    }
    /**
     * token验证
     * @param resource $socket 套接字
     * @param number $cmd 操作码
     * @param array $data 用户发送的包含uid和签名的数组
     * @param number $cbk 回调函数id
     * @param array $extra 透传参数
     */
    private function _tokenCheck($socket, $cmd, $data, $cbk, $extra){
        if($cmd != 0){
            // 如果没有验证则发送提示信息后，断开连接
            $arr['status'] = -1;
            $arr['msg'] = "非法用户，请重新连接后立即验证token";
            $tips = $this -> _pushFormat(100, 0, 0, $arr);
            $this -> _sendMsgPrivate($tips, $socket);
            sleep(1);
            $this -> _disConnect($socket);
        }else{
            $uid = $data['uid'];
            $sign = $data['sign'];
            // 验证签名
            if($this -> _signCheck($uid, $sign)){
                // 是否已经登录过
                if(array_key_exists($uid, $this -> users)){
                    // 异地登录，挤号
                    $tp['status'] = -1;
                    $tp['msg'] = "异地登录";
                    $tips = $this -> _pushFormat(100, 1, 0, $tp);
                    $toClose = $this -> users[$uid];
                    $this -> _sendMsgPrivate($tips, $toClose);
                    sleep(1);
                    $this -> _disConnect($toClose);
                }
                $this -> users[$uid] = $socket;
                $arr['msg'] = "已成功验证token，欢迎".$socket;
                $tips = $this -> _resFormat(0, $arr, null, null);
                $this -> _sendMsgPrivate($tips, $socket);
            }else{
                // 签名验证失败
                $tp['status'] = -1;
                $tp['msg'] = "签名错误，请重新登录";
                $tips = $this -> _pushFormat(100, 2, 0, $tp);
                $toClose = $this -> users[$uid];
                $this -> _sendMsgPrivate($tips, $toClose);
                sleep(1);
                $this -> _disConnect($toClose);
            }
        }
    }
    /**
     * 其他操作的处理
     * @param resource $socket 套接字
     * @param number $cmd 操作码
     * @param array $data 用户发送的包含uid和签名的数组
     * @param number $cbk 回调函数id
     * @param array $extra 透传参数
     */
    private function _Operation($socket, $cmd, $data, $cbk, $extra){
        // 获取当前用户uid
        $uid = array_search($socket, $this -> users);
        // 如果存储对象不存在则实例化
        if (!$this -> stores[$uid]) {
            $this -> stores[$uid] = new Store($uid);
        }
        $store = $this -> stores[$uid];
        switch($cmd){
            case 100:{
                // 获取当前用户信息
                $info = $store -> get_info();
                if ($info === null) {
                    // 如果拿不到信息
                    $info['msg'] = "找不到该用户的信息";
                    $tips = $this -> _resFormat(-1, $info, $cbk, $extra);
                } else {
                    // 如果拿到了信息
                    $tips = $this -> _resFormat(0, $info, $cbk, $extra);
                }
                break;
            }
            case 101:{
                // 设置当前用户信息
                $res = $store -> set_info($data['info']);
                if ($res) {
                    // 设置成功
                    $info['msg'] = "用户信息设置成功";
                    $tips = $this -> _resFormat(0, $info, $cbk, $extra);
                } else {
                    // 设置失败
                    $info['msg'] = "用户信息设置失败";
                    $tips = $this -> _resFormat(-1, $info, $cbk, $extra);
                }
                break;
            }
        }
        // 结果返回
        $this -> _sendMsgPrivate($tips, $socket);
    }
    /**
     * 签名校验
     * @param number $uid 用户uid
     * @param number $sign 用户签名
     * @return boolean $res 验证结果
     */
    private function _signCheck($uid, $sign){
        $token = $this -> redis -> get('token');
        $sg = md5($uid.$token);
        return $sg == $sign ? true : false ;
    }
    /**
     * 用于socket主动推送消息的处理函数
     * @param number $model 首层
     * @param number $type 二层
     * @param number $id 三层
     * @param array $data 推送的数据
     * @return string 返回json编码后的数据
     */
    private function _pushFormat($model, $type, $id, $data){
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
    private function _resFormat($status, $data, $cbk, $extra){
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
    /**
     * 握手动作
     * @param resource $socket 套接字
     * @param string $buffer 字节码
     */
    private function _handshake($socket, $buffer)
    {
        // 获取KEY及生成新的KEY
        $buf = substr($buffer, strpos($buffer, 'Sec-WebSocket-Key:') + 18);
        $key = trim(substr($buf, 0, strpos($buf, "\r\n")));
        $new_key = base64_encode(sha1($key . "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", true));
        // 返回HTTP协议头部信息
        $new_message = "HTTP/1.1 101 Switching Protocols\r\n";
        $new_message .= "Upgrade: websocket\r\n";
        $new_message .= "Sec-WebSocket-Version: 13\r\n";
        $new_message .= "Connection: Upgrade\r\n";
        $new_message .= "Sec-WebSocket-Accept: " . $new_key . "\r\n\r\n";

        // 把数据写入套接字中(向客户端发送数据) 套接字，字符串，字符串的长度
        socket_write($socket, $new_message, strlen($new_message));
        // 握手完成
        $this-> handshake = true;
    }

    /**
     * 断开socket连接
     * @param $socket
     */
    private function _disConnect($socket)
    {
        $index = array_search($socket, $this -> sockets);
        $key = array_search($socket, $this -> users);
        // 删除token验证记录
        unset($this -> users[$key]);
        socket_close($socket);
        if ($index >= 0) {
            array_splice($this->sockets, $index, 1);
        }
        echo "用户".$socket."已下线\n";
    }

    /**
     * 发送信息（私聊）
     * @param string  $buffer 要发送的数据
     * @param resource $target 目标套接字
     */
    private function _sendMsgPrivate($buffer, $target)
    {
        $send_buffer = $this-> _frame($buffer);
        socket_write($target, $send_buffer, strlen($send_buffer));
    }

    /**
     * 发送信息（群聊）
     * @param string $buffer 要发送的数据
     * @param resource $client 发送者
     */
    private function _sendMsg($buffer, $client)
    {
        $send_buffer = $this-> _frame($buffer);
        foreach ($this -> sockets as $socket) {
            if ($socket != $this -> master && $socket != $client) { 
                //广播发送（除了自己）
                socket_write($socket, $send_buffer, strlen($send_buffer));
            }
        }
    }

    /**
     * 解析数据帧
     * @param string $buffer 字节码
     * @return null|string
     */
    private function _decode($buffer)
    {
        $len = $masks = $data = $decoded = null;
        $len = ord($buffer[1]) & 127;
        if ($len === 126) {
            $masks = substr($buffer, 4, 4);
            $data = substr($buffer, 8);
        } else if ($len === 127) {
            $masks = substr($buffer, 10, 4);
            $data = substr($buffer, 14);
        } else {
            $masks = substr($buffer, 2, 4);
            $data = substr($buffer, 6);
        }
        for ($index = 0; $index < strlen($data); $index++) {
            $decoded .= $data[$index] ^ $masks[$index % 4];
        }
        return $decoded;
    }

    /**
     * 处理数据帧
     * @param string $buffer
     * @return string
     */
    private function _frame($buffer)
    {
        $len = strlen($buffer);
        if ($len <= 125) {
            return "\x81" . chr($len) . $buffer;
        } else if ($len <= 65535) {
            return "\x81" . chr(126) . pack("n", $len) . $buffer;
        } else {
            return "\x81" . char(127) . pack("xxxxN", $len) . $buffer;
        }
    }
}

// 开启websocket服务器 ,ip一定要先看ipconfig  ！！！！！！！！！！！！
$socket = new SocketServer('192.168.1.4', 8080);
$socket -> run();
?>