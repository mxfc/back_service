$(function(){function n(n){var e=$("form.add_business");if(!base.formValidate(e))return!1;var s=e.serializeArray();return $.ajax({url:"http://lz.594211.xyz/business/insert",type:"POST",dataType:"json",data:s}).done(function(s){console.log(s),1==s.status?n&&n(!0,s&&s.msg):2==s.status&&(oper_business&&oper_business.box&&oper_business.box.show(),e.find('[name="username"]').val("").focus().parent().operTip(s&&s.msg||"用户名已存在！",{theme:"danger",dir:"top",css:{"white-space":"nowrap"}}))}).fail(function(e){n&&n(!1),console.dir(e)}),!0}function e(){var e=new Box({title:"添加商务",css:{"min-width":"320px","max-width":"420px"},fnSure:function(e,s){return n(e&&e.afterfnSure)?void 0:!1},fnCancel:function(n){}});window.oper_business={box:e}}$('[name="bd_name"]').length?$('form.add_business [name="bd_name"]').attr("data-validate-dir",""):e(),$("body").on("click",".btn_business_submit",function(){n(function(n,e){})})});