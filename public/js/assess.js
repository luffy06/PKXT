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
            "classid":classid
        },
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                $('.problemList').empty();
                //TODO:根据问题列表渲染数据
                var data = {
                        problist: json.problist
                    },
                    probHtml = template('problemTemplate', data);
                $('.problemList').append(probHtml);
                $('.card').eq(0).show();

                timer = startTimer($("span#time"),'timer');
            } else {
                $.toast(json.status);
            }
        }
    });

    
    //计分并切换到下一题
    $(".content-block").on('tap', function(event) {
        var $target = $(event.target);

        if(!$target.hasClass('button')){
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
                "classid":classid
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    //最后一题
                    if(!$parentCard.next('.card')[0]){
                        //TODO:显示答题完成

                        
                        stopTimer(timer,'timer');
                        window.location.href = 'scan.html';
                        return;
                    }

                    //切换到下一题
                    $parentCard.hide();
                    $parentCard.next('.card').show();

                } else {
                    $.toast(json.status);
                }
            }
        });

    });


    //添加在所有pageInit事件后
    $.init();

});
