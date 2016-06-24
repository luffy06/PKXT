 $(function() {
     //登录判定
     $(".button-success").click(function(event) {
         $.post("/user", { "user": $("#username").val(), "pass": $("#password").val() }, function(data, status, xhr) {
             if (status === "success") {
                 $.toast("登录成功!");
             } else {
                 $.alert("登录失败!"); //返回失败信息
             }
         });
     });

     //查询课程
     $("#searchbtn").click(function(event) {
         $("div.result").empty("div.content-block"); //清除上次
         $.showPreloader(); //加载提示
         $.get("/search", { "search": $("#searchinput").val() }, function(data, status, xhr) {
             if (status === "success") {
                 //显示查找到的课程详细信息
                 var resultItem,
                     course,
                     teacher,
                     place,
                     time;
                 resultItem = "<div class='card'>" + 
                 "<div class='card-header'>课程号-课程名</div>" + 
                 "<div class='card-content'>"+
                 "<div class='card-content-inner'>"+
                 "<p>任课老师:</p>"+
                 "<p>上课地点:</p>"+
                 "<p>上课时间:</p>"+
                 "</div>"+
                 "<div class='card-footer'><a href='/assess' class='button button-fill button-primary'>开始评课</a></div>"+
                 "</div>"+
                 "</div>";
                 $("div.content").append(resultItem);
             } else {
                 $.alert("查无此课程!", function() {
                     $("#searchinput").val("");
                 });
             }
             $.hidePreloader();
         });
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
