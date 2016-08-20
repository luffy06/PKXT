$(function() {
    //TODO:调用本地数据，直接请求登录
    var user = getStorage('ccnu_user');
    if (user) {
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: {
                "name": user.name,
                "pass": user.pass
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    $.toast('登录成功');
                    routerTo('scan.html');
                } else {
                    $.toast(json.errormessage);
                }
            }
        });
    }





    //登录判定
    $(".button-success").on('tap', function(event) {
        var name = $("#username").val(),
            pass = $("#password").val(); //TODO:md5加密

        $.ajax({
            url: '/user/login',
            type: 'post',
            data: {
                "name": name,
                "pass": pass
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === "success") {
                    //返回角色，是老师还是学生
                    var role = json.role;

                    $.toast("登录成功!");

                    //数据缓存到本地
                    var user = {
                        name: name,
                        pass: pass,
                        role: role
                    };
                    setStorage('ccnu_user', user);
                    routerTo('scan.html');

                } else {
                    $.alert(json.errormessage); //TODO:更改为相应的失败信息
                }
            }
        });
    });


    //添加在所有pageInit事件后
    $.init();
});
