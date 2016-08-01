$(function() {
    //TODO:获取courseid
    var params = getParams(),
        courseid = params['courseid'];

    $.ajax({
        url: '/course/assesscourse',
        type: 'post',
        data: {
            "courseid": courseid
        },
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                $('.content-block').empty();
                //TODO:根据问题列表渲染数据
                var data = {
                        problist: json.problist
                    },
                    probHtml = template('problemTemplate', data);
                $('.content-block').append(probHtml);
                $('.card').eq(0).show();
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
                        formatTime = hour + 'h' + min + 'm' + sec + 's';
                    $("span#time").text(formatTime);
                }, 1000);

            } else {
                $.toast(json.status);
            }
        }
    });


    //计分并切换到下一题
    $(".content-block ul li a").on('tap', function(event) {
        var $target = $(event.target),
            courseid,
            problemid = $target.parent('.card').find('.problemid').text();
        choiceid = $target[0].id;
        $.ajax({
            url: '/course/savedata',
            type: 'post',
            data: {
                "courseid": courseid,
                "problemid": problemid,
                "choiceid": choiceid
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    //TODO:计分？？

                    //切换到下一题
                    $target.parent('.card').hide();
                    $target.parent('.card').next('.card').show();

                } else {
                    $.toast(json.status);
                }
            }

        });

    });


    //添加在所有pageInit事件后
    $.init();

});
