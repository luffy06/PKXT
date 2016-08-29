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
            "courseid": courseid,
            "classid": classid,
            "edit":1
        },
        dataType: 'json',
        success: function(json) {
            if (json.status === 'success') {
                var problist = json.problist,
                    data = {
                        problist: problist
                    },
                    problistHtml = template('editprobTemplate', data);

                $('.content').append(problistHtml);
                $('.prob').eq(0).show();

            } else {
                $.toast(json.errormessage);
            }
        }

    });





    //提交，并下一题
    $('.content').on('tap', '.button-submit', function(event) {
        var $prob = $('.prob:visible'),
            probdesc = $prob.find('.probdesc').val(),
            problemid = $prob.data('problemid'),
            $input = $prob.find('.item-input input'),
            $target = $(event.target),
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
                "type": 2,
                "prob": {
                    "problemid": problemid,
                    "description": probdesc,
                    "choice": choice,
                    "classid": classid
                }
            },
            dataType: 'json',
            success: function(json) {
                if (json.status === 'success') {
                    var $listblock = $target.parents('.prob'),
                        $nextlistblock = $listblock.next('.prob');

                    $.toast(json.status);
                    //最后一题
                    if (!$nextlistblock[0]) {
                        $.alert('点击确定返回课程信息列表', '编辑完成', function() {
                            routerTo('courselist.html');
                        });

                        return;
                    }

                    //切换到下一题
                    $listblock.slideRight(function() {
                        $listblock.hide();
                        $nextlistblock.removeClass('slideOutLeft');
                        $nextlistblock.show();
                    });
                } else {
                    $.toast(json.errormessage);
                }
            }
        });

    });



    //删除问题
    $('.content').on('tap', '.button-delete', function(event) {
        $.confirm('是否确认删除该问题？', function() {
            var $prob = $('.prob:visible'),
                probdesc = $prob.find('.probdesc').val(),
                problemid = $prob.data('problemid'),
                $input = $prob.find('.item-input input'),
                $target = $(event.target),
                choice = [];

            //删除问题后，对题号进行重新计算
            var _caculateProbIndex = function() {
                var $probs = $('.prob');

                $probs.each(function(index, el) {
                    $(el).find('.problemid').text(index + 1);
                });

            };


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
                    "type": 3,
                    "prob": {
                        "problemid": problemid,
                        "description": probdesc,
                        "choice": choice,
                        "classid": classid
                    }
                },
                dataType: 'json',
                success: function(json) {
                    if (json.status === 'success') {
                        var $listblock = $target.parents('.prob'),
                            $nextlistblock = $listblock.next('.prob');

                        $.toast(json.status);
                        //最后一题
                        if (!$nextlistblock[0]) {
                            $.alert('点击确定返回课程信息列表', '编辑完成', function() {
                                routerTo('courselist.html');
                            });

                            return;
                        }
                        //切换到下一题
                        $listblock.slideRight(function() {
                            $nextlistblock.removeClass('slideOutLeft');
                            $nextlistblock.show();
                            $listblock.remove();
                            _caculateProbIndex(); //重新计数
                        });
                    } else {
                        $.toast(json.errormessage);
                    }
                }
            });
        });

    });

    //上一题,注意题号，前后台需要同步 
    $('.content').on('tap', '.button-prev', function(event) {
        var $target = $(event.target),
            $listblock = $target.parents('.prob'),
            $prevlistblock = $listblock.prev('.prob');

        if (!$prevlistblock[0]) {
            $.alert('已经是第一题了');
            return;
        }

        //切换到上一题
        $listblock.slideLeft(function() {
            $listblock.hide();
            $prevlistblock.removeClass('slideOutRight');
            $prevlistblock.show();
        });

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










    //末尾一定要添加，否则组件bug
    //添加在所有pageInit事件后
    $.init();
});
