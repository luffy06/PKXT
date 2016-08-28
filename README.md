# PKXT

## bug list

1. 学生/教师点击开始评课，提示choiceid undefined。已查看后台传入的数据均有choiceid。
2. 教师编辑问题时，因为问题几时依据problemid而定的，所以需要保证problemid的连续。当保证连续后，删除当前的问题后，将会自动跳过下一个问题，显示空白。Solution：（1）前端另开计数变量？（2）后台每次传入当前问题的index给前端？