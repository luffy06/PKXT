//设置本地存储
function setStorage(name, obj) {
    if (name && obj) {
        var obj = JSON.stringify(obj);
        window.localStorage.setItem(name, obj);
    }
}


//获取本地存储
function getStorage(name) {
    if (typeof name !== 'string') {
        return;
    }
    var user = window.localStorage.getItem(name);
    if (user) {
        return JSON.parse(user);
    }
    return null;
}


//删除本地存储
function removeStorage(name) {
    if (typeof name === 'string') {
        window.localStorage.removeItem(name);
    }
}


//获取url查询参数
function getParams() {
    var arr = window.location.search.substring(1).split('&'),
        params = {},
        temp,
        name,
        value;
    for (var i = 0; i < arr.length; i++) {
        temp = arr[i].split('=');
        name = temp[0];
        value = temp[1];
        params[name] = value;
    }
    return params;
}


//返回学生还是老师判定
function returnStuOrTea() {
    var user = getStorage('user');
    if (user.role === 'teacher') {
        return true;
    }
    return false;
}


$(function() {

    //TODO:存在侧边栏的页面需要进行学生还是老师的判定
    // if($('.panel-left')){
    //   if(returnStuOrTea()){
    //     $('.courselistBtn').show();
    //   }  
    // }



    /*侧边栏跳转功能*/
    //搜索课程scan.html
    $('.scandBtn').on('tap',function(){
        $.router.load('/pages/scan.html');
    });


    //未完成unfinished.html
    $('.unfinishedBtn').on('tap',function(){
        $.router.load('/pages/unfinished.html');
    });

    //课程信息列表
      $('.courselistBtn').on('tap',function(){
        $.router.load('/pages/courselist.html');
    });


    //登出
    $('.logoutBtn').on('tap', function() {
        $.ajax({
            url: '/user/logout',
            type: 'post',
            data: {},
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    $.toast(json.status);
                    $.router.load('/pages/index.html');
                } else {
                    $.toast(json.status);
                }
            }
        });

    });



});
