$(function(){var e={day:"日",week:"周",month:"月"},t={$ct:$(".content"),theme:"success",footerFix:!0,sendData:{cur_page:1,pay_cyc:1},col:[{key:"uid",title:"用户ID",cls:"hidden_xs",sort:!0,filter:!0},{key:"name",title:"名称",sort:!0,filter:!0},{key:"alipay",title:"支付宝",cls:"hidden_xs",filter:!0},{key:"fee_date",title:"费用描述",cls:"hidden_xs",render:function(t,a,n,s){var i="",r=a.split("_");2===r.length?(+r[1]&&(i="每"+e[r[0]]+'<span class="accent_danger big">'+r[1]+"</span>元"),s.fee_per&&+s.fee_per&&(i&&(i+="<br>"),i+='每个<span class="accent_danger big">'+s.fee_per+"</span>元"),s.fee_other&&(i&&(i+="<br>"),i+=s.fee_other)):i="数据失常",t.append(i)}},{key:"payed_fee",title:"已付",sort:!0,render:function(e,t,a,n){n.pay_time?e.addClass("cal_fee"):t='<span class="accent_danger big">'+t+"</span>",e.append(t)}},{key:"cal_fee",title:"应付",sort:!0,render:function(e,t,a,n){n.pay_time||e.addClass("cal_fee"),e.append(t)}},{key:"inviated_num",title:"邀请人数",cls:"hidden_xs",sort:!0},{key:"id",title:"操作",width:60,cls:"t_center",render:function(e,t,a,n){var s,i;n.pay_time?(s="修改",i="btn_warning"):(s="支付",i="btn_info");var r=$('<button type="button" class="btn '+i+' btn_payment">'+s+"</button>");r.data("row_obj",n),e.append(r)}}],isLocal:!0,url:"http://es2.laizhuan.com/back/finance/settlement_query"};6===role&&(t.fnAfterData=function(e){e.data=$.map(e.data,function(e){return e.pid==person_id?e:void 0})});var a=new Table(t);window.renderTable=function(e){setTimeout(function(){a.data=null,a.render()},e||0)},$("body").on("click",'[name="pay_cyc"]',function(){var e=+$(this).val();a.sendData.pay_cyc=e,a.sendData.cur_page=1;var t={1:"success",2:"primary",3:"magenta"};a.theme=t[e],renderTable()}).on("click",".btn_payment",function(){$(".btn_cacel").trigger("click");var e=$(this).data("row_obj"),t=$(this).closest("tr").find(".cal_fee"),a=e.pay_time?e.payed_fee:e.cal_fee;t.html('<input type="text" data-validate="require,num,+" value="'+a+'">'),$(this).removeClass("btn_info btn_payment").addClass("btn_success btn_sure").text("确认").after($('<button type="button" class="btn btn_danger btn_cacel">取消</button>'))}).on("click",".btn_sure",function(){var e=$(this).closest("td"),t=$(this).data("row_obj"),a=$(this).closest("tr").find(".cal_fee input");if(!base.formValidate(a.parent()))return!1;var n=new Mask({$ct:e,content:"提交中！"}),s={uid:t.uid,pid:t.pid,payed_fee:+a.val(),cal_fee:t.cal_fee,fee_log_json:"{fee_date: "+t.fee_date+",fee_per: "+t.fee_per+",fee_other: "+t.fee_other+",fee_add_type: "+t.fee_add_type+"}"};t.pay_time&&(s.bid=t.bid),$.ajax({url:"http://es2.laizhuan.com/back/finance/settlement_confirm",dataType:"json",data:s}).done(function(t){1===t.status?e.operTip(t.msg||"成功",{dir:"left",css:{"white-space":"nowrap"},theme:"success"}):e.operTip(t.msg||"失败",{dir:"left",css:{"white-space":"nowrap"},theme:"danger"}),renderTable(1e3)}).fail(function(){e.operTip("失败",{dir:"left",css:{"white-space":"nowrap"},theme:"danger"})}).always(function(){n.hide()})}).on("click",".btn_cacel",function(){var e,t,a=$(this).prev().data("row_obj");a.pay_time?(e="修改",t=a.payed_fee,cls="btn_warning"):(e="支付",t=a.cal_fee,cls="btn_info"),$(this).closest("tr").find(".cal_fee").html(t),$(this).prev().removeClass("btn_success btn_sure").addClass("btn_payment "+cls).text(e).next().remove()})});