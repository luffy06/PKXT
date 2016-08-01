$(function(){
  //TODO:获取courseid
  // var params = getParams(),
  //     courseid = params['courseid'];


  //提交
  $('.button-success').on('tap',function(){
      var probdesc = $('#probdesc').val(),
          $input = $('.item-input input'),
          choice = [];
          $input.each(function(index) {
              var obj = {
                choiceid:index,//??
                choicedes: $(this).val()
              };
              choice.push(obj);
          });

      $.ajax({
        url:'/course/addproblem',
        type:'post',
        data:{
          prob:{
            "description":probdesc,
            "choice":choice
          }
        },
        dataType:'json',
        success:function(json){
            if(json.status === 'success'){
              $.toast(json.status);
              $.router.load('courselist.html');
            }else{
              $.toast(json.status);
            }
        }
      })

  });


  //取消
  $('.button-danger').on('tap',function(){
      $.router.load('courselist.html');
  });



});