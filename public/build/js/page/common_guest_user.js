$(function(){var t={$ct:$(".content"),col:[{key:"uid",title:"用户ID",sort:!0,filter:!0},{key:"type",title:"类别",sort:!0,filter:!0},{key:"name",title:"名称",sort:!0,filter:!0},{key:"pay",title:"费用",sort:!0,filter:!0},{key:"alipay",title:"支付宝",sort:!0,cls:"hidden_xs"},{key:"fans_num",title:"粉丝数",sort:!0,cls:"hidden_xs"},{key:"id",title:"操作",width:60,cls:"t_center",render:function(t,e){var n=$('<button type="button" class="btn btn_info btn_query_detail" data-id="'+e+'">查看</button>');t.append(n)}}],isLocal:!0,url:"http://es2.laizhuan.com/back/guest_user/query"};6!==role&&t.col.unshift({key:"pname",title:"推广人员",sort:!0,filter:!0}),window.renderTable=function(){e.data=null,e.render()};var e=new Table(t);$("body").on("click","table .btn_query_detail",function(){window.open("http://es2.laizhuan.com/back/page/guest_user_detail/"+$(this).data("id"))})});