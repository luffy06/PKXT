$(function() {
    //TODO:调用本地数据，直接请求登录
    //      var user = getStorage('user');
    //     $.ajax({
    //         url: '/user/login',
    //         type:'post',
    //         data:{
    //             "name":user.name,
    //             "pass":user.pass
    //         },
    //         dataType:'json',
    //         success: function(json){
    //             if(json.status === 'success'){
    //                 $.toast('登录成功');
    //                 $.router.load('scan.html?role='+user.role+'&'+'name='+user.name);
    //             }else{
    //                 removeStorage('user');
    //             }
    //         }
    //     });
    // }





    //登录判定
    $(".button-success").on('tap', function(event) {
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: {
                "name": $("#username").val(),
                "pass": $("#password").val()
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === "success") {
                    //TODO:返回角色，是老师还是学生
                    //var role = josn.role;
                    $.toast("登录成功!");

                    //TODO:存放到本地
                    //     var user = {
                    //         name: $("#username").val(),
                    //         pass: $("#password").val(),
                    //         role: role
                    //     };
                    //    setStorage('user',user);
                   



                    //TODO:判定是学生还是老师，在url上加上不同的参数
                    role = 'student';
                    window.location.href = 'scan.html?role='+ role;
                    
                } else {
                    $.alert(json.errormessage); //TODO:更改为相应的失败信息
                }
            }
        });
    });


    //添加在所有pageInit事件后
    $.init();
});
