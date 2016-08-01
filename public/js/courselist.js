$(function() {
    $.ajax({
        url: '/course/courselist',
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
            courseid = $target.parent('.card').find('.courseid').text();
        $.router.load('editprob.html?courseid=' + courseid);
    });

    //增加问题
    $('.result .card .addBtn').on('tap', function(event) {
        var $target = $(event.target),
            courseid = $target.parent('.card').find('.courseid').text();
        $.router.load('addprob.html?courseid=' + courseid);
    });


});
