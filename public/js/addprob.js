$(function() {
    var params = getParams(),
        courseid = params.courseid,
        classid = params.classid;

    //提交
    $('.button-success').on('tap', function() {
        var probdesc = $('#probdesc').val(),
            $input = $('.item-input input'),
            choice = [];
        $input.each(function(index) {
            var obj = {
                choiceid: index,
                choicedes: $(this).val()
            };
            choice.push(obj);
        });

        $.ajax({
            url: '/course/editproblem',
            type: 'post',
            data: {
                "courseid": courseid ,
                "classid": classid,
                "type": 1
                "prob": {
                    "description": probdesc,
                    "choice": choice,
                }
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    $.toast(json.status);
                    window.location.href = 'courselist.html';
                } else {
                    $.toast(json.status);
                }
            }
        })

    });


    //取消
    $('.button-danger').on('tap', function() {
        window.location.href = 'courselist.html';
    });



});
