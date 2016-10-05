$(function() {
    var params = getParams(),
        courseid = params.courseid,
        classid = params.classid;

    $.ajax({
        url: '/course/getsummary',
        type: 'post',
        data: {
            "classid": classid,
            "courseid": courseid
        },
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                $('.problemList').empty();

                template.helper('timeFormat', function(data) {
                    var time = data / 10,
                        hour = Math.floor(time / 3600),
                        min = Math.floor((time - hour * 3600) / 60),
                        sec = time - hour * 3600 - min * 60,
                        formatTime = hour + 'h ' + min + 'm ' + sec + 's';

                    return formatTime;
                });

                template.helper('percentFormat', function(data) {
                    return data * 100;
                });


                var data = {
                        problist: json.problist,
                        commentlist: json.commentlist
                    },
                    probHtml = template('problemTemplate', data);

                $('.problemList').append(probHtml);
                $('.card').eq(0).show();

            } else {
                $.toast(json.errormessage);
            }
        }

    });

    //上一题
    $('.content').on('tap', '.button-prev', function(event) {
        var $curDiv = $('.content').find('.cardDiv:visible'),
            $prevDiv = $curDiv.prev('.cardDiv');

        if (!$prevDiv[0]) {
            $.alert('已经是第一题了');
            return;
        }

        $curDiv.slideLeft(function() {
            $curDiv.hide();
            $prevDiv.removeClass('slideOutRight');
            $prevDiv.show();
        });

    });

    //下一题
    $('.content').on('tap', '.button-next', function(event) {
        var $curDiv = $('.content').find('.cardDiv:visible'),
            $nextDiv = $curDiv.next('.cardDiv');

        if (!$nextDiv[0]) {
            $.alert('已经是最后一题了');
            return;
        }

        $curDiv.slideRight(function() {
            $curDiv.hide();
            $nextDiv.removeClass('slideOutLeft');
            $nextDiv.show();
        });

    });


    //返回列表页
    $('.content').on('tap', '.button-back', function(event){
        routerTo('courselist.html');
    });


});
