$(function() {
    //TODO:获取url上的参数，判定是老师或学生
    //合并到一个统一的js上，用来统一判定




    //查询课程
    $("#searchbtn").on('tap', function(event) {
        $("div.result").empty("div.content-block"); //清除上次
        $.showPreloader(); //加载提示
        $.ajax({
            url: '/course/scan',
            type: 'post',
            data: {
                "courseid": $("#searchinput").val()
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === "success") {
                    //显示查找到的课程详细信息
                    var resultHtml,
                        data = {
                            title: json.title,
                            course: json.course,
                            teachername: json.teachername
                        };

                    resultHtml = template('searchResultTemplate', data);
                    $("div.result").append(resultHtml);

                } else {
                    $.alert("查无此课程!", function() {
                        $("#searchinput").val("");
                    });
                }
                $.hidePreloader();
            }
        });
    });

    //评课
    $('.content').on('tap', '.assessBtn', function(event) {
        var $target = $(event.target),
            courseid = $target.parent('.card').find('.courseid').text();

        //url上传递courseid
        $.router.load('assess.html?courseid='+courseid);

    });



    







    //末尾一定要添加，否则组件bug
    //添加在所有pageInit事件后
    $.init();
});
