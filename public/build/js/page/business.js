$(function(){var e={$ct:$(".content"),col:[{key:"name",title:"姓名",sort:!0,filter:!0},{key:"phone",title:"电话",sort:!0,filter:!0},{key:"username",title:"账户",sort:!0,filter:!0,cls:"hidden_xs"},{key:"price_all",title:"销售额",sort:!0,cls:"hidden_xs",filter:!0},{key:"taskNum",title:"任务数",sort:!0,filter:!0},{key:"id",title:"操作",width:60,cls:"t_center",render:function(e,t){var n=$('<button type="button" class="btn btn_info btn_query_detail" data-id="'+t+'">查看</button>');e.append(n)}}],isLocal:!0,url:"http://lz.594211.xyz/business/query"},t=new Table(e);window.renderTable=function(){t.data=null,t.render()},$("body").on("click","table .btn_query_detail",function(){window.open("http://lz.594211.xyz/page/business_detail/"+$(this).data("id"))}).on("click",".btn_business_add",function(){oper_business.box.initHeader("添加商务"),oper_business.box.initContent("http://lz.594211.xyz/page/business_add .add_business_form",function(){oper_business.box.show()});var e=$(this).parent();oper_business.box.afterfnSure=function(t,n){t?(e.operTip(n||"操作成功！",{theme:"warning",css:{"white-space":"nowrap"}}),renderTable()):e.operTip(n||"操作失败！",{theme:"danger",css:{"white-space":"nowrap"}})}})});