//设置本地存储obj
function setStorage(name, obj) {
    if (name && obj) {
        var obj = JSON.stringify(obj);
        window.localStorage.setItem(name, obj);
    }
}


//获取本地存储obj
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
    var user = getStorage('ccnu_user');

    if (user.role === 'teacher') {
        return true;
    }
    return false;
}


//自动计时
function startTimer($time) {
    //自动计时
    var time = 0,
        hour,
        min,
        sec,
        formatTime,
        timer;

    timer = setInterval(function() {
        time += 1;
        hour = Math.floor(time / 3600),
            min = Math.floor((time - hour * 3600) / 60),
            sec = time - hour * 3600 - min * 60,
            formatTime = hour + 'h ' + min + 'm ' + sec + 's';
        $time.text(formatTime);
        $time.data('seconds', time);
    }, 1000);

    return timer;
}

//结束计时
function stopTimer(timer) {
    clearInterval(timer);
}


//路由
function routerTo(page, params) {
    var href = page + '?';

    if (params) {
        for (var i in params) {
            href += (i + '=' + params[i] + '&');
        }
    }

    window.location.href = href.slice(0, href.length - 1);
}


$(function() {
    //TODO:change CDN

    //存在侧边栏的页面需要进行学生还是老师的判定
    if ($('.panel-left')[0]) {
        //存在侧边栏的页面需要更改用户名
        var $username = $('#username');
        if ($username[0] && getStorage('ccnu_user')) {
            var username = getStorage('ccnu_user').name;
            $username.text(username);
        }
        if (returnStuOrTea()) {
            $('.courselistBtn').show(); //若为教师，显示课程列表
        }
    }





    /*侧边栏跳转功能*/
    //搜索课程scan.html
    $('.scandBtn').on('tap', function() {
        routerTo('scan.html');
    });

    //未完成unfinished.html
    $('.unfinishedBtn').on('tap', function() {
        routerTo('unfinished.html');
    });

    //课程信息列表
    $('.courselistBtn').on('tap', function() {
        routerTo('courselist.html');
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
                    $.toast('登出成功');
                    window.localStorage.clear();//删除所有保存的信息
                    routerTo('index.html');
                } else {
                    $.toast(json.errormessage);
                }
            }
        });

    });

    //滑动效果
    $.fn.slideRight = function(callback) {
        this.addClass('slideOutRight animated');
        setTimeout(callback,1000);
    };


    $.fn.slideLeft = function(callback){
        this.addClass('slideOutLeft animated');
        setTimeout(callback,1000);
    }



});
