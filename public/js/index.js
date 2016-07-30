$(function() {
    //TODO:调用本地数据，直接请求登录
    // var user = window.localStorage.getItem('user');
    // if( user){
    //     user = JSON.parse(user);
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
    //                 // window.localStorage.removeItem('user')
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
                    //var role = josn.role;
                    $.toast("登录成功!");

                    //TODO:存放到本地
                    // if (window.localStorage) {
                    //     var user = {
                    //         "name": $("#username").val(),
                    //         "pass": $("#password").val(),
                    //         "role":
                    //     };
                    //     user = JSON.stringify(user);
                    //     window.localStorage.setItem('user',user);
                    // }



                    //TODO:判定是学生还是老师，在url上加上不同的参数
                    $.router.load('scan.html?role=' + role);
                } else {
                    $.alert("登录失败!"); //TODO:更改为相应的失败信息
                }
            }
        });
    });


    //添加在所有pageInit事件后
    $.init();
});
