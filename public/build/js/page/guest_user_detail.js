$(function(){var t=base.getParam("id"),e=new Box({title:"IDFA("+t+")",html:'<div class="idfa_list t_right"><button type="button" class="btn btn_info">导出</button></div>',css:{"max-width":700},footer:!1});$("body").on("click",".query_idfa",function(){var t={$ct:$(".idfa_list"),col:[{key:"id",title:"IDFA",sort:!0,filter:!0},{key:"login",title:"邀请时间",sort:!0,filter:!0},{key:"login_times",title:"再邀请人数",sort:!0,filter:!0}],isLocal:!0,theme:"warning",url:"http://es2.laizhuan.com/back/js/json/user.json"};!$(".idfa_list .table").length&&new Table(t),e.show()}).on("click",".query_num",function(){window.open("http://es2.laizhuan.com/back/html/report/guest_user.html?id="+t)}).on("click",".query_money",function(){window.open("http://es2.laizhuan.com/back/html/report/guest_user.html?id="+t+"&type=money")})});