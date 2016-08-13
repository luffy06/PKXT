$(function() {
    $.ajax({
        url: '/course/courseinfo',
        type: 'post',
        data: {

        },
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                var data = {
                        courselist: json.courselist
                    },
                    courselistHtml = template('courselistTemplate', data);
                $('.result').append(courselistHtml);
            } else {
                $.toast(json.status);
            }
        }
    });

    //修改问题
    $('.result .card .editBtn').on('tap', function(event) {
        var $target = $(event.target),
            $parentCard = $target.parent('.card'),
            classid = $parentCard.find('.classid').text(),
            courseid = $parentCard.find('.courseid').text();

        window.location.href = 'editprob.html?courseid=' + courseid + '&classid=' + classid;
    });

    //增加问题
    $('.result .card .addBtn').on('tap', function(event) {
        var $target = $(event.target),
            courseid = $target.parent('.card').find('.courseid').text();
        window.location.href = 'addprob.html?courseid=' + courseid + '&classid=' + classid;
    });


});
