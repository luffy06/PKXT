$(function() {
    var params = getParams(),
        courseid = params.courseid,
        classid = params.classid,
        problist = null;


    //获取问题信息
    $.ajax({
        url: '/course/problemlist',
        type: 'post',
        data: {

        },
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                var problist = json.problist,
                    data = {
                        problist: problist
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
            url: '/course/editproblem',
            type: 'post',
            data: {
                "courseid": courseid ,
                "classid": classid,
                "type": 2
                prob: {
                    "description": probdesc,
                    "choice": choice,
                    "classid":classid
                }
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    var $listblock = $target.parent('.list-block');

                    $.toast(json.status);
                      //切换到下一题
                    $listblock.hide();
                    $listblock.next('.list-block').show();

                } else {
                    $.toast(json.status);
                }
            }
        });

    });



    //删除问题
    $('.button-danger').on('tap', function() {
         $.ajax({
            url: '/course/editproblem',
            type: 'post',
            data: {
                "courseid": courseid ,
                "classid": classid,
                "type": 3
                prob: {
                    "description": probdesc,
                    "choice": choice,
                    "classid":classid
                }
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    $.toast(json.status);
                     //切换到下一题
                    $listblock.remove();
                    $listblock.next('.list-block').show();

                } else {
                    $.toast(json.status);
                }
            }
        })
    });

    //TODO:上一题,注意题号，前后台需要同步 


});
