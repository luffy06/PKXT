$(function() {


    //查询课程
    $("#searchbtn").on('tap', function(event) {
        $("div.result").empty("div.content-block"); //清除上次
        $.showPreloader(); //加载提示
        $.ajax({
            url: '/course/courseinfo',
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
                            courselist: json.courselist
                        };

                    resultHtml = template('searchResultTemplate', data);
                    $("div.result").append(resultHtml);

                } else {
                    $.alert(json.errormessage);
                }
                $.hidePreloader();
            }
        });
    });

    //评课
    $('.content').on('tap', '.assessBtn', function(event) {
        var $target = $(event.target),
            courseid = $target.parent('.card').find('.courseid').text(),
            classid = $target.parent('.card').find('.classid').text();

        //url上传递courseid
        window.location.href = 'assess.html?courseid=' + courseid + '&classid=' + classid;
    });











    //末尾一定要添加，否则组件bug
    //添加在所有pageInit事件后
    $.init();
});
