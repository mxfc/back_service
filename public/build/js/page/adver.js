$(function(){var e={$ct:$(".content"),col:[{key:"bd_name",title:"商务",sort:!0,filter:!0,cls:"hidden_xs"},{key:"company",title:"公司",sort:!0,filter:!0,cls:"hidden_xs"},{key:"name",title:"姓名",sort:!0,filter:!0},{key:"phone",title:"电话",sort:!0,filter:!0,cls:"hidden_xs"},{key:"price_all",title:"消费",sort:!0,filter:!0},{key:"money",title:"余额",sort:!0,filter:!0},{key:"taskNum",title:"任务数",sort:!0,filter:!0,cls:"hidden_xs"},{key:"username",title:"账号",sort:!0,filter:!0},{key:"id",title:"操作",width:60,cls:"t_center",render:function(e,t){var n=$('<button type="button" class="btn btn_info btn_query_detail" data-id="'+t+'">查看</button>');e.append(n)}}],isLocal:!0,url:"http://192.168.1.211:9211/adver/query"},t=new Table(e);window.renderTable=function(){t.data=null,t.render()},$("body").on("click","table .btn_query_detail",function(){window.open("http://192.168.1.211:9211/page/adver_detail/"+$(this).data("id"))}).on("click",".btn_adver_add",function(){oper_adver.box.initHeader("添加广告主"),oper_adver.box.initContent("http://192.168.1.211:9211/page/adver_add .add_adver_form",function(){oper_adver.box.show()});var e=$(this).parent();oper_adver.box.afterfnSure=function(t,n){t?(e.operTip(n||"操作成功！",{theme:"warning"}),renderTable()):e.operTip(n||"操作失败！",{theme:"danger",css:{"white-space":"nowrap"}})}})});