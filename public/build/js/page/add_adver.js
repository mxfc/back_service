$(function(){function a(a){var e=$("form.add_adver");if(!base.formValidate(e))return!1;var n=e.serializeArray();return $.ajax({url:"http://lz.594211.xyz/adver/insert",type:"POST",dataType:"json",data:n}).done(function(n){1==n.status?a&&a(!0,n&&n.msg):2==n.status&&(oper_adver&&oper_adver.box&&oper_adver.box.show(),e.find('[name="username"]').val("").focus().parent().operTip(n&&n.msg||"用户名已存在！",{theme:"danger",dir:"top",css:{"white-space":"nowrap"}}))}).fail(function(e){a&&a(!1),console.dir(e)}),!0}function e(){var e=new Box({title:"添加广告主",html:"http://lz.594211.xyz/page/adver_add .add_adver_form",css:{"min-width":"320px","max-width":"420px"},fnSure:function(e,n){return a(e&&e.afterfnSure)?void 0:!1},fnCancel:function(a){}});window.oper_adver={box:e}}$('[name="ad_company"]').length?$('form.add_adver [name="ad_company"]').attr("data-validate-dir",""):e(),$("body").on("click",".btn_adver_submit",function(){a(function(a,e){})})});