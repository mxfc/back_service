$(function(){function e(){var e=base.calDate("i",-(new Date).getMinutes()),a=base.calDate("y",1,e);r=$(".date_start").val(base.date("y-m-d h:i",e)).datepicker({format:"y-m-d h:i",min:"today",datetime:e}),o=$(".date_end").val(base.date("y-m-d h:i",a)).datepicker({format:"y-m-d h:i",min:"today",datetime:a}),$(".source_id_ct").suggest({key:"id",val:"name",$key_ct:$('[name="source_id"]'),$val_ct:$(".source_name"),data:n})}function a(e){var a=$("form.add_task"),t=["storeurl","stime","expire","countall","steptime","id","name"],i=["link","keyword","keywordTop","source_id","iscomment"],r=["price","taskprice"],o=["isDeviceVer"],s=["steptime_acc","isiPhone","isreg","isWifi","isSim","isJailbreak","isIp","isIpcn","isSided","isIdfa"];$.each(t,function(t,i){$('[name="'+i+'"]',a).val(e[i])}),$.each(i,function(t,i){var r=e[i]&&"0"!==e[i];$(".ct_"+i,a).prop("checked",r).trigger("change"),r&&($('[name="'+i+'"]',a).val(e[i]),"source_id"===i&&$(".source_name").val(n[e[i]]))}),$.each(r,function(t,i){var n=$('[name="'+i+'"][value="'+e[i]+'"]',a);n.length?n.prop("checked",!0):($(".ct_"+i,a).prop("checked",!0).trigger("change"),$('[type="text"][name="'+i+'"]',a).val(e[i]))}),$.each(o,function(t,i){$('[name="'+i+'"][value="'+e[i]+'"]',a).prop("checked",!0)}),$.each(s,function(t,i){$('[name="'+i+'"]',a).prop("checked","1"===e[i])})}function t(e){var a=$("form.add_task");if(!base.formValidate(a))return!1;$('[name="price"][data-show]:checked,[name="taskprice"][data-show]:checked').prop("disabled",!0);var t=a.serializeArray(),i=oper_task.box.operType;return $.ajax({url:"http://lz.bramble.wang/task/"+i,type:"POST",dataType:"json",data:t}).done(function(t){1==t.status?(e&&e(!0,t&&t.msg),"insert"===i&&window.open("http://lz.bramble.wang/page/task_detail/"+t.data)):2==t.status&&(oper_task&&oper_task.box&&oper_task.box.show(),a.find('[name="storeurl"]').focus().parent().operTip(t&&t.msg||"任务链接错误!",{theme:"danger",dir:"bottom",css:{"white-space":"nowrap"}}))}).fail(function(a){e&&e(),console.dir(a)}),!0}function i(){var i=new Box({title:"添加特邀用户",html:"http://lz.bramble.wang/page/task_add .add_task_form",css:{"min-width":"320px"},fnSure:function(e,a){return t(e&&e.afterfnSure)?void 0:!1},fnCancel:function(e){}});window.oper_task={box:i,initWidget:e,source_data:n,renderTaskForm:a}}var n={};$.ajax({url:"http://lz.bramble.wang/source/query",dataType:"json"}).done(function(e){1==e.status&&$.each(e.data,function(e,a){n[a.id]=a.name})});var r,o;$(".date_start").length?(e(),$('form.add_task [name="storeurl"]').attr("data-validate-dir","")):i(),$(".source_id_ct").suggest({key:"id",val:"name",$key_ct:$('[name="source_id"]'),$val_ct:$(".source_name"),url:"http://lz.bramble.wang/source/query"}),$("body").on("change",".date_start,.date_end",function(){$(this).is(".date_start")?o.cgOpt({min:$(this).val()}):r.cgOpt({max:$(this).val()})}).on("click",".btn_task_submit",function(){t(function(e){})})});