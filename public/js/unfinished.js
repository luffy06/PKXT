$(function() {
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


});
