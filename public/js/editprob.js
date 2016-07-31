$(function() {
    //TODO:获取courseid
    // var params = getParams(),
    //     courseid = params['courseid'];


    //获取问题信息
    $.ajax({
        url: '/course/problemlist',
        type: 'post',
        data: {

        },
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                var data = {
                        problist: json.problist
                    },
                    problistHtml = template('editprobTemplate',data);
               $('.content').append(problistHtml);
               $('.list-block').eq(0).show();

            } else {
                $.toast(json.status);
            }
        }



    });





    //提交，并下一题
    $('.button-success').on('tap', function(event) {
        var probdesc = $('#probdesc').val(),
            $input = $('.list-block:visible .item-input input'),
            $target = $(event.target),
            choice = [];
        $input.each(function(index) {
            var obj = {
                choiceid: index, //??
                choicedes: $(this).val()
            };
            choice.push(obj);
        });

        $.ajax({
            url: '/course/addproblem',
            type: 'post',
            data: {
                prob: {
                    "description": probdesc,
                    "choice": choice
                }
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    $.toast(json.status);

                      //切换到下一题
                    $target.parent('.list-block').hide();
                    $target.parent('.list-block').next('.list-block').show();

                } else {
                    $.toast(json.status);
                }
            }
        })

    });


    //取消
    $('.button-danger').on('tap', function() {
        $.router.load('courselist.html');
    });



});
