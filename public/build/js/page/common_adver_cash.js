$(function(){var e={$ct:$(".content"),col:[{key:"name",title:"广告主",cls:"hidden_xs",sort:!0,filter:!0},{key:"createdAt",title:"时间",cls:"hidden_xs",sort:!0,filter:!0},{key:"money",title:"收入/支出",sort:!0,filter:!0},{key:"token",title:"明细",sort:!0,filter:!0},{key:"username",title:"操作人",sort:!0,cls:"hidden_xs"}],isLocal:!0,url:"http://es2.laizhuan.com/back/finance/adver_cash"};2===role,e.col.push({key:"id",title:"操作",width:60,cls:"t_center",render:function(e,t){var n=$('<button type="button" class="btn btn_info btn_confirm" data-id="'+t+'">确认</button>');e.append(n)}}),window.renderTable=function(){t.data=null,t.render()};var t=new Table(e);$("body").on("click","table .btn_confirm",function(){var e=$(this).parent(),t=$(this).data("id");$.ajax({url:"http://es2.laizhuan.com/back/finance/adver_cash_confirm",type:"POST",dataType:"json",data:{id:t}}).done(function(t){1==t.status?(e.operTip(t.msg||"操作成功!",{theme:"success",dir:"left",css:{"white-space":"nowrap"}}),setTimeout(renderTable,1e3)):e.operTip(t.msg||"操作失败!",{theme:"danger",dir:"left",css:{"white-space":"nowrap"}})}).fail(function(t){e.operTip("操作失败!",{theme:"danger",dir:"left",css:{"white-space":"nowrap"}})})})});