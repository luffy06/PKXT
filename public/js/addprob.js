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
                "courseid": courseid,
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
                    $.toast(json.errormessage);
                }
            }
        })

    });

    //新增选项
    $('.content').on('tap', '.button-addChoice', function(event) {
        var $choiceUl = $('.list-block ul:visible'),
            $choiceLis = $choiceUl.find('.choice');
        data = {
                choiceid: $choiceLis.length + 1
            },
            newChoiceHtml = template('newChoiceTemplate', data);

        $choiceLis.eq(-1).after(newChoiceHtml);
    });

    //删除选项
    $('.content').on('tap', '.reomveChoice', function(event) {
        $.confirm('是否确认删除该选项', function() {
            var $target = $(event.target),
                $removeChoice = $target.parents('.choice'),
                $choiceLis = $removeChoice.siblings('.choice'),
                //删除选项后，重新计算选项序号
                _caculateChoiceIndex = function() {
                    $choiceLis.each(function(index, el) {
                        $(el).find('.choiceid').text(index + 1);
                    });
                };

            $removeChoice.remove();
            _caculateChoiceIndex();
        });
    });



    //取消
    $('.button-danger').on('tap','.button-cancel', function() {
        routerTo('courselist.html');
    });


    //末尾一定要添加，否则组件bug
    //添加在所有pageInit事件后
    $.init();

});
