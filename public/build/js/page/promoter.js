$(function(){var t={$ct:$(".content"),col:[{key:"login_times",title:"姓名",filter:!0},{key:"phone",title:"电话",filter:!0},{key:"money",title:"账户",filter:!0,cls:"hidden_xs"},{key:"money",title:"推广费用",sort:!0},{key:"today",title:"产生的消费",sort:!0,cls:"hidden_xs"},{key:"today",title:"完成任务数",sort:!0,cls:"hidden_xs"},{key:"id",title:"操作",width:60,cls:"t_center",render:function(t,e){var o=$('<button type="button" class="btn btn_info btn_query_detail" data-id="'+e+'">查看</button>');t.append(o)}}],isLocal:!0,url:"http://192.168.1.211:9211/js/json/user.json"};new Table(t),$("body").on("click","table .btn_query_detail",function(){window.open("http://192.168.1.211:9211/promoter/promoter_detail/"+$(this).data("id"))}).on("click",".btn_promoter_add",function(){oper_promoter.box.initHeader("添加推广人员"),oper_promoter.box.initContent("http://192.168.1.211:9211/page/promoter_add .add_promoter_form",function(){oper_promoter.box.show()});var t=$(this).closest("td");oper_promoter.box.afterfnSure=function(e){t.operTip(e||"操作成功！",{theme:"warning"})}})});