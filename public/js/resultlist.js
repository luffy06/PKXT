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


});
