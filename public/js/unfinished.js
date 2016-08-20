$(function() {
    //获取未完成的评课信息
    $.ajax({
        url: '/course/unfinished',
        type: 'post',
        data: {
        },
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                var data = {
                        courselist: json.courselist
                    },
                    unfinishedHtml = template('unfinishedTemplate', data);
                $('.result').append(unfinishedHtml);
            } else {
                $.toast(json.status);
            }
        }
    });

    //继续评课
    $('.result').on('tap','.assessBtn',function(event){
        var $target = $(event.target),
            $card = $target.parents('.card'),
            courseid = $card.find('.courseid').text(),
            classid = $card.find('.classid').text();

        routerTo('assess.html',{
            courseid:courseid,
            classid:classid
        });

    })



    //末尾一定要添加，否则组件bug
    //添加在所有pageInit事件后
    $.init();

});
