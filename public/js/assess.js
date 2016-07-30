$(function(){

  //TODO:获取url上的参数，判定是老师或学生
  //合并到一个统一的js上，用来统一判定



  //获取courseid
  $.ajax({
    url:'/course/assesscourse',
    type:'post',
    data:{
      "courseid":courseid
    },
    dataType:'json',
    success: function(json){

    }
  });







     var time = 0,
         timer;
     //自动计时
     $(document).on("pageInit", function(e, pageId, $page) {
         if (pageId === 'assess') {
             timer = setInterval(function() {
                 time += 1;
                 $("span#time").text(time);
             }, 1000);
         }
     });

     //计分并切换到下一题
     $("div.list-block ul li a").click(function(event) {
         //计分
         var score,
             data;//储存当前得分和题目数，传到后台记录，以防突然退出
            

         //切换到下一题
        changeToNext(data);
     });

     function changeToNext(data){
         $.get('/number',data,function(data,status,xhr){
            if(data.status==="success"){
                $("#questionNumber").text();
                $("#questionContent").text();
                //每个选项
                $("#questionChoices a").each(function(index){

                });
            }else{
                changeToNext(data);//重新发送
            }
         });
     }



     //添加在所有pageInit事件后
     $.init();

});