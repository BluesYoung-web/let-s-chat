# 后端接口

> 除登录和上传采用post传输之外，其他数据全部使用socket传输

接口路径 | 功能
--- | ---
/api/login | 用户登录
/api/upload | 文件上传

## socket传输格式

name | type | des
--- | --- | ---
cmd | number | 操作码
data | json string | json字符串
cbk | number | 回调函数id
extra | string | 透传参数

## cmd 范围划分

range | des
--- | ---
0 | token验证
1 - 100 | 用户相关操作
101 - 200 | 好友相关操作
201 - 300 | 好友圈相关操作
301 - 400 | 聊天相关操作