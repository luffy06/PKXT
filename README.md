# PKXT

## bug list

1. 跳转assesscourse时，多传一个edit给后台，值为0。跳转problemlist时，多传一个edit给后台，值为1。
2. 评课和编辑问题时的问题${value}还是依据problemid把。因为考虑继续评课的时候，只显示未评的课，但是问题不应该重新编号把？比如之前已经评过问题1，下一次继续评课的时候，后台不会将问题1的数据传给前端，但是前端需要显示当前评的问题是问题2。