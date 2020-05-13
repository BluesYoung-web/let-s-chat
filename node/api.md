# 接口说明文档

## 登录

- POST : /login

> request

argname | des | need
--- | --- | ---
tel | 手机号 | no
wxid | 微信id | no

> response

key | type | des
--- | --- | ---
status | number | 0 成功，-1 失败
data | json | 返回的数据
msg | string | 提示信息

> response.data

key | type | des
--- | --- | ---
bnew | number | 0 不是新用户， 1 是新用户
user | json | 用户信息

> response.data.user

key | type | des
--- | --- | --- 
uid | number | uid
nick | string | 昵称
avatar | string | 头像url
motto | string | 个性签名
tel | string | 手机号
wxid | string | 微信id
token | string | 口令

## 上传

- POST : /post

> request

argname | type | des | need
--- | --- | --- | ---
filePath | string | 文件临时路径 | yes
name | string | 文件类型 (img/audio) | yes

> response

key | type | des
--- | --- | ---
status | number | 0 成功， -1 失败
data | json | 文件上传信息
msg | string | 提示信息

> response.data 

key | type | des 
--- | --- | ---
url | string | 文件上传之后的地址

## websocket cmd

> 范围

range | des
--- | ---
[100, 200) | 用户相关
[200, 300) | 好友圈相关
[300, 400) | 好友相关
[400, 500) | 聊天相关

> 详细

cmd | des
--- | ---
100 | 获取用户信息
101 | 设置用户信息
102 | 搜索用户
200 | 发布好友圈
201 | 获取我能看到的好友圈
202 | 删除我发表的好友圈
203 | 点赞
204 | 取消点赞
205 | 发表评论
207 | 获取点赞列表
208 | 获取评论列表
209 | 获取我发表的所有好友圈
300 | 通过uid获取用户详细信息（是否为好友，是否在线）
301 | 获取好友列表
302 | 发送好友申请
303 | 删除好友
304 | 关注
305 | 取消关注
306 | 获取好友验证列表
307 | 处理好友验证
308 | 获取被关注的人
309 | 获取关注的人
310 | 获取发表的好友圈
400 | 创建聊天室
401 | 获取聊天室信息
402 | 聊天室内发消息
403 | 拉人进聊天室
404 | 退出聊天室
405 | 设置聊天室信息
406 | 获取我加入的群聊


## 服务器推送

model | type | id | des
--- | --- | --- | ---
100 | 0 | 4000 | 异地登录
100 | 0 | 4003 | token验证失败
101 | 0 | 0 | 有新的好友圈动态
102 | 0 | 0 | 有新的好友申请
102 | 0 | 1 | 被删除了
103 | 0 | 0 | 收到聊天室内的消息
103 | 0 | 1 | 聊天室信息被修改了