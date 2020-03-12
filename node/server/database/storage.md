# 各种数据的存放
---
## user

- 用户信息
- 存于MySQL的lailiao数据库user表

name | type | des
--- | --- | --- |
uid | number | 唯一id，自增
nick | string | 昵称
avatar | string | 头像url
motto | string | 个性签名
tel | number | 手机号
wxid | string | 微信id

## friend

- 好友列表
- 存于MongoDB的lailiao数据库的friend集合

name | type | des  
--- | --- | ---
_id | ObjectId | 数据库自己生成的唯一标识
uid | number | 用户
friendsList | array | 用户对应的好友的uid组成的数组

## focus

- 关注列表
- 存于MongoDB的lailiao数据库的focus集合

name | type | des  
--- | --- | ---
_id | ObjectId | 数据库自己生成的唯一标识
uid | number | 用户
focusList | array | 用户关注的人的uid组成的数组