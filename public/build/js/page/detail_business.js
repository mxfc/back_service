$(function(){var e,a=new Box({title:"修改商务",css:{"min-width":"320px","max-width":"420px"},fnSure:function(a,n){if(!base.formValidate(e))return!1;$.trim($('[name="resetpwd"]').val())||$('[name="resetpwd"]').prop("disabled",!0);var t=e.serializeArray();$('[name="resetpwd"]').prop("disabled",!1),$.ajax({url:"http://lz.594211.xyz/business/edit",type:"POST",dataType:"json",data:t}).done(function(e){console.log(e),1==e.status&&(window.location.href=window.location.href,window.opener&&window.opener.renderTable&&window.opener.renderTable())}).fail(function(e){console.dir(e)})},fnCancel:function(e){}});a.initContent("http://lz.594211.xyz/page/business_add .add_business_form",function(){e=$("form.add_business"),$('[name="name"]').val(bdData.name).before($('<input type="hidden" name="id" value="'+bdData.id+'">')),$('[name="phone"]').val(bdData.phone),$('[name="username"]').val(bdData.username).prop("disabled",!0),$('[name="password"]').attr("name","resetpwd").attr("placeholder","如不修改请留空").removeAttr("data-validate")}),$("body").on("click",".btn_edit",function(){a.show()})});