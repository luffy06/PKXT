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
            courseid: courseid,
            classid: classid
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
                $.toast(json.status);
            }
        }

    });





    //提交，并下一题
    $('.content').on('tap', '.button-success', function(event) {
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
                    var $listblock = $target.parents('.prob');

                    $.toast(json.status);
                    //最后一题
                    if(!$listblock.next('.prob')[0]){
                          $.alert('点击确定返回课程信息列表', '编辑完成', function() {
                            routerTo('courselist.html');
                        });

                        return;
                    }

                    //切换到下一题
                    $listblock.slideRight(function() {
                        $listblock.hide();
                        $listblock.next('.prob').show();
                    });
                } else {
                    $.toast(json.status);
                }
            }
        });

    });



    //删除问题
    $('.content').on('tap', '.button-danger', function() {
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
                    var $listblock = $target.parents('.prob');
                    $.toast(json.status);
                    //最后一题
                    if(!$listblock.next('.prob')[0]){
                          $.alert('点击确定返回课程信息列表', '编辑完成', function() {
                            routerTo('courselist.html');
                        });

                        return;
                    }
                    //切换到下一题
                    $listblock.slideRight(function() {
                        $listblock.next('.prob').show();
                        $listblock.remove();
                    });
                } else {
                    $.toast(json.status);
                }
            }
        })
    });

    //TODO:上一题,注意题号，前后台需要同步 


    //末尾一定要添加，否则组件bug
    //添加在所有pageInit事件后
    $.init();
});
