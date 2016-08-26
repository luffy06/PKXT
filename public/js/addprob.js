$(function() {
    var params = getParams(),
        courseid = params.courseid,
        classid = params.classid;

    //提交
    $('.button-success').on('tap', function() {
        var $prob = $('.prob:visible'),
            probdesc = $prob.find('.probdesc').val(),
            $input = $prob.find('.item-input input'),
            choice = [];

        $input.each(function(index) {
            var $this = $(this),
                $item = $this.parents('.item-content'),
                obj = {
                    choiceid: $item.find('.choiceid').text(),
                    choicedesc: $(this).val()
                };
            choice.push(obj);
        });

        $.ajax({
            url: '/course/editproblem',
            type: 'post',
            data: {
                "courseid": courseid ,
                "classid": classid,
                "type": 1,
                "prob": {
                    "description": probdesc,
                    "choice": choice,
                }
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    $.toast(json.status);
                    routerTo('courselist.html');
                } else {
                    $.toast(json.status);
                }
            }
        })

    });


    //取消
    $('.button-danger').on('tap', function() {
        routerTo('courselist.html');
    });


    //末尾一定要添加，否则组件bug
    //添加在所有pageInit事件后
    $.init();

});
