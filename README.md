# PKXT

## work list

~~1. 跳转assesscourse时，多传一个edit给后台，值为0。跳转problemlist时，多传一个~~edit~~给后台，值为1。~~  
~~2. 评课和编辑问题时的问题${value}还是依据problemid把。因为考虑继续评课的时候，只显示未评的课，但是问题不应该重新编号把？比如之前已经评过问题1，下一次继续评课的时候，后台不会将问题1的数据传给前端，但是前端需要显示当前评的问题是问题2。~~  
~~3. 记录每题的时间保存在数据库中，需要给老师一个展示统计结果的页面。~~
~~4. 添加提意见的文本框。~~
~~5. interface.md中带有（新）的为更新后的接口。~~
6. 课程信息中不需要显示任课老师姓名。
7. 从未完成页面进入评课页面时，若之前已经评完所有问题，但剩下评论未写，这种情况下，无法显示评论。解决方案:因为之前会传回一个变量为pid，若其值为0，则表示评论