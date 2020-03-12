# 各种数据的存放
---
## user

- 用户信息

name | type | des
--- | --- | --- |
uid | number | 唯一id，自增
nick | string | 昵称
avatar | string | 头像url
motto | string | 个性签名
tel | number | 手机号
wxid | string | 微信id

## friends

- 好友列表

name | type | des  
--- | --- | ---
id | number | 唯一id，自增
uid | number | 用户
fid | number | 好友

## focus

- 关注列表

name | type | des  
--- | --- | ---
name | type | des  
--- | --- | ---
id | number | 唯一id，自增
uid | number | 用户
fid | number | 好友