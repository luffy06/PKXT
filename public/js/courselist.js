$(function() {
    $.ajax({
        url: '/course/courselist',
        type: 'post',
        data: {},
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                var data = {
                        courselist: json.courselist
                    },
                    courselistHtml = template('courselistTemplate', data);

                $('.result').append(courselistHtml);
            } else {
                $.toast(json.errormessage);
            }
        }
    });

    //修改问题
    $('.result').on('tap', '.editBtn', function(event) {
        var $target = $(event.target),
            $parentCard = $target.parents('.card'),
            classid = $parentCard.find('.classid').text(),
            courseid = $parentCard.find('.courseid').text();

        routerTo('editprob.html', {
            courseid: courseid,
            classid: classid
        });
    });

    //增加问题
    $('.result').on('tap', '.addBtn', function(event) {
        var $target = $(event.target),
            $parentCard = $target.parents('.card'),
            courseid = $parentCard.find('.courseid').text(),
            classid = $parentCard.find('.classid').text();

        routerTo('addprob.html', {
            courseid: courseid,
            classid: classid
        });
    });

    
    //末尾一定要添加，否则组件bug
    //添加在所有pageInit事件后
    $.init();

});
