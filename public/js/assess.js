$(function() {
    var params = getParams(),
        courseid = params.courseid,
        classid = params.classid,
        timer = null; //计时器

    $.ajax({
        url: '/course/assesscourse',
        type: 'post',
        data: {
            "courseid": courseid,
            "classid": classid,
            "edit": 0
        },
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                $('.problemList').empty();
                var data = {
                        problist: json.problist,
                        startpid: json.startpid
                    },
                    probHtml = template('problemTemplate', data);

                $('.problemList').append(probHtml);
                $('.card').eq(0).show();

                timer = startTimer($("#time"));
            } else {
                $.toast(json.errormessage);
            }
        }
    });


    //计时并切换到下一题
    $(".content-block").on('tap', '.button-choice', function(event) {
        var $target = $(event.target);

        stopTimer(timer); //停止计时

        var $parentCard = $target.parents('.card'),
            problemid = $parentCard.find('.problemid').text(),
            choiceid = $target.data('choiceid'),
            $time = $('#time'),
            costtimeText = $time.text(),
            costtime = parseInt($time.data('seconds'), 10);

        $.ajax({
            url: '/course/savedata',
            type: 'post',
            data: {
                "courseid": courseid,
                "problemid": problemid,
                "choiceid": choiceid,
                "classid": classid,
                "costtime": costtime
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    //重新开始计时
                    timer = startTimer($("#time"));

                    //最后一题
                    if (!$parentCard.next('.card')[0]) {
                        //显示写下意见
                        $parentCard.slideRight(function() {
                            $parentCard.hide();
                            $parentCard.next('.commentDiv').show();
                        });
                        return;
                    }

                    //滑动切换到下一题
                    $parentCard.slideRight(function() {
                        $parentCard.hide();
                        $parentCard.next('.card').show();
                    });


                } else {
                    $.toast(json.errormessage);
                }
            }
        });

    });


    //提交意见
    $(".content-block").on('tap', '.button-reset', function(event) {
        $('.comment').val('');
    });

    $(".content-block").on('tap', '.button-submit', function(event) {
        var comment = $('.comment').val();

        $.ajax({
            url: '/course/savedata',
            type: 'post',
            data: {
                "courseid": courseid,
                "classid":classid,
                "courseid": courseid
            },
            dataType: 'json',
            success: function(json){
                if (json.status === 'success') {
                    $.alert('评课完成！', function() {
                        routerTo('scan.html');
                    });
                } else {
                    $.toast(json.errormessage);
                }
            }
        });

    });


    //添加在所有pageInit事件后
    $.init();

});
