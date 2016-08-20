$(function() {
    var params = getParams(),
        courseid = params.courseid,
        classid = params.classid,
        timer = null, //计时器
        timerName = 'timer_' + courseid + '_' + classid; // 根据不同的课程课堂号存储时间

    $.ajax({
        url: '/course/assesscourse',
        type: 'post',
        data: {
            "courseid": courseid,
            "classid": classid
        },
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                $('.problemList').empty();
                var data = {
                        problist: json.problist
                    },
                    probHtml = template('problemTemplate', data);

                $('.problemList').append(probHtml);
                $('.card').eq(0).show();

                timer = startTimer($("span#time"), timerName);
            } else {
                $.toast(json.status);
            }
        }
    });


    //计分并切换到下一题
    $(".content-block").on('tap', function(event) {
        var $target = $(event.target);

        if (!$target.hasClass('button')) {
            return;
        }

        var $parentCard = $target.parents('.card'),
            problemid = $parentCard.find('.problemid').text(),
            choiceid = $target.data('choiceid');

        $.ajax({
            url: '/course/savedata',
            type: 'post',
            data: {
                "courseid": courseid,
                "problemid": problemid,
                "choiceid": choiceid,
                "classid": classid
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    //最后一题
                    if (!$parentCard.next('.card')[0]) {
                        //显示答题完成
                        var result = '总用时：' + $("span#time").text();

                        $.alert(result, '答题完成', function() {
                            stopTimer(timer, timerName);
                            routerTo('scan.html');
                        });
                        return;
                    }

                    //滑动切换到下一题
                    $parentCard.slideRight(function(){
                        $parentCard.hide();
                        $parentCard.next('.card').show();
                    });
                    

                } else {
                    $.toast(json.status);
                }
            }
        });

    });


    //添加在所有pageInit事件后
    $.init();

});
