$(function(){var t={$ct:$(".content"),col:[{key:"id",title:"ID",filter:!0},{key:"name",title:"姓名",filter:!0},{key:"username",title:"账号",filter:!0},{key:"phone",title:"电话",filter:!0,cls:"hidden_xs"},{key:"createdAt",title:"创建时间",sort:!0,cls:"hidden_xs"},{key:"updatedAt",title:"最近操作时间",sort:!0,cls:"hidden_xs"},{key:"id",title:"操作",width:60,cls:"t_center",render:function(t,e){var o=$('<button type="button" class="btn btn_info btn_query_detail" data-id="'+e+'">查看</button>');t.append(o)}}],isLocal:!0,url:"http://es2.laizhuan.com/back/promoter/query"},e=new Table(t);window.renderTable=function(){e.data=null,e.render()},$("body").on("click","table .btn_query_detail",function(){window.open("http://es2.laizhuan.com/back/page/promoter_detail/"+$(this).data("id"))}).on("click",".btn_promoter_add",function(){oper_promoter.box.initHeader("添加推广人员"),oper_promoter.box.initContent("http://es2.laizhuan.com/back/page/promoter_add .add_promoter_form",function(){oper_promoter.box.show()});var t=$(this).closest("td");oper_promoter.box.afterfnSure=function(e){t.operTip(e||"操作成功！",{theme:"warning"})}})});