# 接口文档

[TOC]

## 登录

url: /user/login

type: post

data: null

returnData: {

​	status,

​	role

}

method: user.login

## 登出

url: /user/logout

type: post

data: null

reutrnData: {

​	status

}

method: user.logout

## 搜索课程号

url: /course/courseinfo

type: post

data: { courseid }

reutrnData: {

​	status,

​	courselist: [{

​		courseid,

​		classid,

​		coursename,

​		teachername	

​	}]

}

method: course.getinfo

## 未完成

url: /course/unfinished

type: post

data: null

returnData: {

​	status,

​	courselist: [{

​		courseid,

​		classid,

​		coursename,

​		teachername

​	}]

}

method: selection.getunfinished

## 评课时获取问题列表（新）

url: /course/assesscourse

type: post

data: {

​	courseid,

​	classid,

​	edit (= 0)

}

returnData: {

​	status,

​	startpid,

​	problist: [{

​		problemid,

​		description,

​		choice: [{

​			choiceid,

​			choicedesc

​		}]

​	}]

}

method: course.getproblemlist

**<u>若problist长度为0，显示意见框。</u>**

## 保存答题进度（新）

url: /course/savedata

type: post

data: {

​	courseid,

​	classid,

​	problemid,

​	choiceid,

​	<u>**costtime**</u>

}

returnData: {

​	status

}

method: selection.savedata

## 保存意见（新）

url: /course/savedata

type: post

data: {

​	courseid,

​	classid,

​	comment

}

method: selection.savedata

## 课程信息列表（教师）

url: /course/courselist

type: post

data: null

returnData: {

​	status,

​	courselist: [{

​		courseid,

​		classid,

​		coursename

​	}]

}

method: course.getcourselist

## 修改问题列表（教师）

url: /course/assesscourse

type: post

data: {

​	courseid,

​	classid,

​	edit (= 1)

}

returnData: {

​	status,

​	problist: [{

​		problemid,

​		description,

​		choice: [{

​			choiceid,

​			choicedesc

​		}]

​	}]

}

method: course.getproblemlist

## 保存修改问题 / 删除问题 / 增加问题（教师） 

url: /course/editproblem

type: post

data: {

​	courseid,

​	classid,

​	type,

​	prob: {

​		problemid,

​		description,

​		choice: [{

​			choiceid,

​			choicedesc

​		}]

​	}

}

returnData: {

​	status

}

method: course.editproblem

## 查看课程总结（教师）（新）

url: /course/getsummary

type: post

data: {

​	courseid,

​	classid

}

returnData: {

​	status,

​	problist: [{

​		description,

​		choice: [{

​			choicedesc,

​			percent

​		}]				

​	}],

​	commentlist

}

method: course.getsummary

commentlist是一个String类型的数组