$(function(){$("body").on("click",".btn_modify",function(){oper_task.box.initHeader("修改任务"),oper_task.box.operType="modify",oper_task.box.initContent("http://lz.594211.xyz/page/task_add .add_task_form",function(){oper_task.box.show(),oper_task.initWidget(),$("form.add_task .show_by_edit").removeClass("hidden").find("input").prop("disabled",!1),window.oper_task.renderTaskForm(taskData)});var e=$(this).parent();oper_task.box.afterfnSure=function(t,o){t?e.operTip(o||"操作成功！",{theme:"warning",css:{"white-space":"nowrap"}}):e.operTip(o||"操作失败！",{theme:"danger",css:{"white-space":"nowrap"}})}}).on("click",".btn_copy",function(){oper_task.box.initHeader("任务续单"),oper_task.box.operType="insert",oper_task.box.initContent("http://lz.594211.xyz/page/task_add .add_task_form",function(){oper_task.box.show(),oper_task.initWidget(),window.oper_task.renderTaskForm(taskData)});var e=$(this).parent();oper_task.box.afterfnSure=function(t,o){t?(e.operTip(o||"操作成功！",{theme:"warning",css:{"white-space":"nowrap"}}),window.close()):e.operTip(o||"操作失败！",{theme:"danger",css:{"white-space":"nowrap"}})}})});