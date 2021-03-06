
    $(function() {
        var operUrl = "http://es2.laizhuan.com/module/interface/index.php";
        // 接口参数系统值 配置列表
        var systemOpts = [
            {
                key: "idfa",
                val: "IDFA"
            }, {
                key: "appid",
                val: "AppID"
            }, {
                key: "ip",
                val: "IP"
            }, {
                key: "dver",
                val: "设备版本"
            }, {
                key: "time",
                val: "时间戳"
            }, {
                key: "md5",
                val: "MD5"
            }, {
                key: "callback",
                val: "回调"
            }
        ];
        // 来源(source) 配置列表 定义及获取
        var sourceMask = new Mask({$ct: $(".content"),content:"来源数据加载中！"});
        var source_data = {};
        $.ajax({
            async: false,
            url: '_HOST_/source/query',
            dataType: "json"
        }).done(function(data) {
            if(data && data.status === 1){
                $.each(data.data,function(i,item){
                    source_data[item.id] = item.name;
                });
            }else{
                $(".opers").operTip((data && data.msg) || "来源数据异常",{dir:'bottom',theme: 'danger',timeout: 5000,css:{'white-space':'nowrap'}});
            }
        }).fail(function(){
            $(".opers").operTip("获取来源信息失败",{dir:'bottom',theme: 'danger',timeout: 5000,css:{'white-space':'nowrap'}});
        }).always(function(){
            sourceMask.hide();
        });

        // 首页表格 配置及初始化
        var opt = {
            $ct: $(".docking_list"),
            col: [{
                key: "id",
                title: "ID",
                show: false
            }, {
                key: "app_id",
                title: "APP ID",
                sort: true,
                filter: true
            }, {
                key: "app_name",
                title: "名称",
                sort: true,
                filter: true
            }, {
                key: "source_name",
                title: "来源",
                sort: true,
                filter: true
            }, {
                key: "unique_url",
                title: "排重接口",
                sort: true,
                cls: "hidden_xs",
                filter: true,
                render: function(td,val,tr,obj){
                    var icon = obj.unique_req_url ? '<i class="iconfont icon-8a4 icon_test" data-type="unique"></i>' : '';
                    $(td).html(val+icon);
                }
            }, {
                key: "click_url",
                title: "点击上报",
                sort: true,
                cls: "hidden_xs",
                filter: true,
                render: function(td,val,tr,obj){
                    var icon = obj.click_req_url ? '<i class="iconfont icon-8a4 icon_test" data-type="click"></i>' : '';
                    $(td).html(val+icon);
                }
            }, {
                key: "active_url",
                title: "激活上报",
                sort: true,
                cls: "hidden_xs",
                filter: true,
                render: function(td,val,tr,obj){
                    var icon = obj.active_req_url ? '<i class="iconfont icon-8a4 icon_test" data-type="active"></i>' : '';
                    $(td).html(val+icon);
                }
            }, {
                key: "id",
                title: "操作",
                cls: "text_center",
                render: function(td, val, tr, obj){
                    $(tr).data("data-obj", obj);
                    var $btns = $('<div class="table_btns"><button class="btn btn_info btn_search" type="button">查看</button>' + '<button class="btn btn_primary btn_renew" type="button">续单</button>' + '</div><div class="table_btns"><button class="btn btn_warning btn_edit" type="button">修改</button>' + '<button class="btn btn_danger btn_remove" type="button">删除</button></div>');
                    $(td).html($btns);
                }
            }],
            // page: false,
            isLocal: true,
            url: operUrl,
            fnAfterData: function(data){
                if(!(data && data.data && data.data.length)){
                    return false;
                }
                $.each(data.data,function(i,item){
                    paddingData(item);
                });
            }
        };
        var table = new Table(opt);

        // 定义弹出窗口，增改查续使用同一窗口
        var box_docking = new Box({
            title:"接口",
            html:"_HOST_/page/docking_add .docking_form",
            fnSure: function(that){
                var $dockForm = $('.docking_edit');
                // 是否查看模式
                if($dockForm.is(".readonly")){
                    that.hide();
                }else{
                    // 验证表单
                    if(!base.formValidate($dockForm)){
                        return false;
                    }
                    // 发送表单数据
                    sendForm($dockForm,that);
                }
                return false;
            },
            fnCancel: function(t){},
            css: {
                "min-width": "300px"
            }
        });
        var box_idfa = new Box({
            title:"idfa",
            html:'<input type="text" class="test_dock_idfa">',
            fnSure: function(that){
                that.sendData.idfa = that.$el.find('.test_dock_idfa').val();
                sendTestDocking(that.sendData,that.$td);
            },
            fnCancel: function(t){},
            css: {
                "min-width": "300px"
            }
        });
        // 发送表单
        function sendForm($dockForm,that){
            var $id = $dockForm.find('[name="id"]');
            var form_cnt = $dockForm.serializeArray();
            var send_data = [{name: "oper_type",value: "insert"}];
            // 存在id的情况是修改
            if($id.length){
                send_data[0].value = "update";
                send_data.push({
                    name: "id",
                    value: $id.val()
                });
            }
            // 发送数据到后台
            $.ajax({
                type: "POST",
                url: operUrl,
                dataType: "json",
                data: send_data.concat(form_cnt)
            }).done(function(data){
                if(data.status == 1){
                    var isAdd = true;
                    var id = $id.val();
                    if(id){
                        isAdd = false;
                    }else{
                        id = data.id;
                    }
                    updateData(form_cnt,id,isAdd);
                }else{
                    $(".opers").operTip(data.msg || "操作出现异常！",{theme: "danger"});
                }
            }).fail(function(){
                $(".opers").operTip("添加失败！",{theme: "danger",css:{"white-space":"nowrap"}});
            }).always(function(){                            
                that.hide();
            });
        };
        // 填补数据
        function paddingData(item){
            // 将获取到的来源id查找到对应的来源name 并给数据新增来源name一栏 方便本地搜索排序
            // 将获取到的url及参数拼接起来 并给数据对应的新增三栏 方便本地搜索排序
            item.source_name = source_data[item.source] || "关联来源失败("+(item.source || '')+")";
            item.unique_url = (item.unique_req_url || '无')+relateParam(item.unique_param_key,item.unique_param_val);
            item.click_url = (item.click_req_url || '无')+relateParam(item.click_param_key,item.click_param_val);
            item.active_url = (item.active_req_url || '无')+relateParam(item.active_param_key,item.active_param_val);
        }
        // 同步本地数据
        function updateData(form_cnt,id,isAdd){
            if(id === undefined){
                $(".opers").operTip("操作异常！",{theme: "danger",css:{"white-space":"nowrap"}});
            }else{
                var new_item = {id: id};
                $.each(form_cnt,function(i,item){
                    var _key = item.name;
                    var _val = item.value;
                    if(~_key.indexOf('_param_key[') || ~_key.indexOf('_param_val[')){
                        var _k = 'new_item["'+_key.slice(0,_key.indexOf('['))+'"]';
                        eval('!'+_k+' ? ('+_k+'=["'+_val+'"]) : '+_k+'.push("'+_val+'")');
                    }else{
                        new_item[_key] = _val;
                    }
                });

                paddingData(new_item);

                // 增续或修改
                if(isAdd){
                    table.data.push(new_item);
                }else{
                    $.each(table.data,function(i,item){
                        if(item.id == id){
                            table.data[i] = new_item;
                            return false;
                        }
                    });
                }
                // 渲染表格
                table.renderData();
                $(".opers").operTip("操作成功！",{theme: "success",css:{"white-space":"nowrap"}});
            }
        }
        // 传对应的参数key数组和参数val数组 生成参数串
        function relateParam(param_keys,param_vals){
            var params = '';
            if(param_keys && param_keys.length){
                $.each(param_keys,function(i,item){
                    if(item === ''){
                        return true;
                    }
                    var _val = param_vals[i];
                    getSysOptName(_val) && (_val = '{'+_val+'}');
                    params += '&' + item + '=' + _val;
                });
            }
            params = params.length > 1 ? '?' + params.slice(1) : '';
            return params;
        }

        // 删除一条记录
        function remove_docking_item(id,fn){
            $.ajax({
                type: "POST",
                url: operUrl,
                dataType: "json",
                data: {
                    oper_type: "delete",
                    id: id
                }
            }).done(function(data) {
                if(data && data.status === 1){
                    $('.table_filter').operTip("删除成功！",{dir:'bottom',theme: 'success',timeout: 5000,css:{'white-space':'nowrap'}});
                }else{
                    $('.table_filter').operTip((data && data.msg) || "删除响应异常",{dir:'bottom',theme: 'danger',timeout: 5000,css:{'white-space':'nowrap'}});
                }
            }).fail(function(){
                $td.operTip("删除失败！",{dir:'bottom',theme: 'danger',timeout: 5000,css:{'white-space':'nowrap'}});
            }).always(function(){
                fn && fn();
                sourceMask.hide();
            });
        }
        // 触发添加参数行按钮
        function trigger_plus($el,len){
            if(len){
                for(var i = 0; i < len; i++){
                    $el.trigger("click");
                }
            }
        }
        // 表单数据回填
        function renderForm(id){
            base.renderOption($('#source'),source_data,["id","name"]);

            // 定义并找到待回填的数据
            var edit_data;
            $.each(table.data,function(i,item){
                if(item.id == id){
                    edit_data = item;
                    return false;
                }
            });

            // 来源框置为suggest控件
            $('.source_ct').suggest({
                key: 'id',
                val: 'name',
                $key_ct: $('[name="source"]'),
                $val_ct: $('.source_name'),
                data: source_data
            });
            //补填来源名称
            $(".docking_edit .source_name").val(source_data[edit_data.source]);
            // 给当前表单的文本框添加必填验证
            base.requireChild($(".docking_edit"));

            // 如果存在对应的参数根据长度触发相应次数的添加参数行按钮
            trigger_plus($('.unique_docking_content .icon_plus'),edit_data.unique_param_key && edit_data.unique_param_key.length);
            trigger_plus($('.click_docking_content .icon_plus'),edit_data.click_param_key && edit_data.click_param_key.length);
            trigger_plus($('.active_docking_content .icon_plus'),edit_data.active_param_key && edit_data.active_param_key.length);

            // 重置所有的带name的复选框为关闭并触发相应的事件 带动显示隐藏控制
            $('[name][type="checkbox"]',$(".docking_edit")).prop('checked',false).trigger('change');
            // 根据数据回填表单并 带动相应的显示隐藏控制
            base.renderForm($(".docking_edit"),edit_data,function(key){
                // 存在MD5值打开相应的md5按钮（MD5没有name  不向后台传，纯粹是控制显示隐藏）
                if(key === "unique_md5_val" && edit_data[key] !== undefined){
                    $('[data-show=".unique_md5_content"]').prop("checked",true).trigger("change");
                }else if(key === "click_md5_val" && edit_data[key] !== undefined){
                    $('[data-show=".click_md5_content"]').prop("checked",true).trigger("change");
                }else if(key === "active_md5_val" && edit_data[key] !== undefined){
                    $('[data-show=".active_md5_content"]').prop("checked",true).trigger("change");
                };
            },function(i,_val,key){
                //判断是系统值还是预设值
                if(~$.inArray(key,['unique_param_val','click_param_val','active_param_val'])){
                    if(!getSysOptName(_val)){
                        $('[name="'+key+'['+i+']"]').closest(".param_item").find("select").eq(0).val("preset").trigger("change");
                        $('select[name="'+key+'['+i+']"]').val("idfa"); 
                    }else{
                        $('input[name="'+key+'['+i+']"]').val("");
                    }
                }
            });
        }
        // 拼接url并回填到长参数容器内
        function renderUrl($el){
            var $url = $('[name$="_req_url"]',$el);
            var keys = $('[name*="_param_key"]',$el).map(function(){
                return $(this).val();
            });
            var vals = $('[name*="_param_val"]:not(:disabled)',$el).map(function(){
                return $(this).val();
            });

            $('.url_all',$el).html($url.val()+relateParam(keys,vals));
        }
        // 根据系统值的id获取name
        function getSysOptName(key){
            var val;
            $.each(systemOpts,function(i,item){
                if(item.key === key){
                    val = item.val;
                    return false;
                }
            });
            return val;
        }
        // 接口测试
        function testDocking(id,type,$td){
            var sendData = {
                module: "test_interface",
                id: id,
                action: type
            };
            if(type !== "unique"){
                sendTestDocking(sendData,$td);
            }else{
                box_idfa.sendData = sendData;
                box_idfa.$td = $td;
                box_idfa.show();
            }
        }
        // 发送接口测试请求到后台
        function sendTestDocking(sendData,$td){
            var thisMask = new Mask({$ct: $td,content:"接口测试中！"});
            $.ajax({
                url: operUrl,
                dataType: "json",
                data: sendData
            }).done(function(data) {
                console.dir(data);
                if(data && data.status === 1){
                    $td.operTip("成功",{dir:'bottom',theme: 'success',timeout: 5000});
                }else{
                    $td.operTip((data && data.msg) || "返回数据异常",{dir:'bottom',theme: 'danger',timeout: 5000});
                }
            }).fail(function(){
                $td.operTip("获取来源信息失败",{dir:'bottom',theme: 'danger',timeout: 5000});
            }).always(function(){
                thisMask.hide();
            });
        }
        $(".content").on('click','.btn_remove',function(){
            // 删除当前行
            var id = $(this).closest('tr').data("data-obj").id;
            var tip = new Tip({
                $ct: $(this).closest('td'),
                content: '确认删除？',
                confirm: true,
                css:{
                    "white-space": "nowrap"
                },
                theme: "warning",
                dir: "left",
                alertfn: function(flag){
                    if(flag){
                        remove_docking_item(id,function(){
                            table.data = $.grep(table.data,function(item){
                                return item.id !== id;
                            });
                            table.renderData();
                        });
                    }
                }
            });
        }).on('click','.btn_edit',function(){
            // 修改当前行
            var id = $(this).closest('tr').data("data-obj").id;
            box_docking.initHeader('修改接口');

            box_docking.initContent('_HOST_/page/docking_add .docking_form',function(){
                renderForm(id);
                $(".docking_edit").prepend($('<input name="id" type="hidden" value="'+id+'">'));
                box_docking.show();
            });
        }).on('click','.btn_renew',function(){
            // 根据当前行续单
            var id = $(this).closest('tr').data("data-obj").id;
            box_docking.initHeader('续单接口');

            box_docking.initContent('_HOST_/page/docking_add .docking_form',function(){
                renderForm(id);
                box_docking.show();
            });
        }).on('click','.btn_search',function(){
            // 查看当前行
            var id = $(this).closest('tr').data("data-obj").id;
            box_docking.initHeader('查看详情');

            box_docking.initContent('_HOST_/page/docking_add .docking_form',function(){
                renderForm(id);
                $(".docking_edit").addClass("readonly");
                $(".docking_edit :input").prop("disabled",true);
                box_docking.show();
            });
        }).on('click','.add_docking',function(){
            // 添加数据
            box_docking.initHeader('添加接口');
            box_docking.initContent('_HOST_/page/docking_add .docking_form',function(){
                // 来源框置为suggest控件
                $('.source_ct').suggest({
                    key: 'id',
                    val: 'name',
                    $key_ct: $('[name="source"]'),
                    $val_ct: $('.source_name'),
                    data: source_data
                });
                //- base.renderOption($('#source'),source_data,["id","name"]);
                base.requireChild($(".docking_edit"));
                $(".icon_plus").trigger("click",'insert');
                box_docking.show();
            });
        }).on('click','.icon_test',function(){
            var data = $(this).closest('tr').data('data-obj');
            var type = $(this).attr('data-type');
            testDocking(data.id,type,$(this).closest('td'));
        });

        $("body").on("click",".docking_content .icon_plus",function(e,oper){
            // 添加参数行
            var prefix;
            var docking = $(this).closest('.docking_content');
            if(docking.is('.unique_docking_content')){
                prefix = "unique";
            }else if(docking.is('.click_docking_content')){
                prefix = "click";
            }else if(docking.is('.active_docking_content')){
                prefix = "active";
            }

            var idx = $(this).data("data-index") || 0;

            // 非排重情况下的点击和激活上报的第一行参数需要disabled（因为默认隐藏）
            var isDisabled = (idx === 0 && prefix !== "unique" && oper === 'insert') ? " disabled " : " ";
            var param_item = $('<li class="param_item">'
                                +'<div class="grid">'
                                    +'<div class="ct_5-2 grid_nowrap">'
                                        +'<div class="ct_3 field field_first">'
                                            +'参数'
                                        +'</div>'
                                        +'<div class="ct_3-2">'
                                            +'<select'+isDisabled+'>'
                                                +'<option value="system" data-show="#'+prefix+'_system_val_'+idx+'">系统值</option>'
                                                +'<option value="preset" data-show="#'+prefix+'_preset_val_'+idx+'">预设值</option>'
                                            +'</select>'
                                        +'</div>'
                                    +'</div>'
                                    +'<div class="ct_5-3 grid">'
                                        +'<div class="ct_2 grid_nowrap">'
                                            +'<div class="ct_3 field">key</div>'
                                            +'<div class="ct_3-2">'
                                                +'<input type="text"'+isDisabled+'id="'+prefix+'_param_key['+idx+']" name="'+prefix+'_param_key['+idx+']">'
                                            +'</div>'
                                        +'</div>'
                                        +'<div class="ct_2 grid_nowrap">'
                                            +'<div class="ct_3 field">value</div>'
                                            +'<div class="ct_3-2">'
                                                +'<select id="'+prefix+'_system_val_'+idx+'" name="'+prefix+'_param_val['+idx+']"'+isDisabled+'>'
                                                +'</select>'
                                                +'<input type="text" disabled class="hidden" id="'+prefix+'_preset_val_'+idx+'" name="'+prefix+'_param_val['+idx+']">'
                                            +'</div>'
                                        +'</div>'
                                    +'</div>'
                                    +'<i class="iconfont icon-66d icon_remove"></i>'
                                +'</div>'
                            +'</li>');
            $(this).closest(".docking_content").find(".param_items").append(param_item);
            // 为添加的行中的系统值下拉框渲染option
            base.renderOption($('#'+prefix+'_system_val_'+idx+''),systemOpts);
            $(this).data("data-index",++idx);
            // 为添加的行中的文本框添加验证
            base.requireChild(param_item);
        }).on('click','.docking_content .icon_remove',function(){
            // 删除当前参数行
            var that = this;
            var tip = new Tip({
                $ct: $(this),
                content: '确认删除？',
                confirm: true,
                css:{
                    "white-space": "nowrap"
                },
                theme: "warning",
                dir: "left",
                alertfn: function(flag){
                    if(flag){
                        var dockingCnt = $(that).closest('.docking_content');
                        $(that).closest('.param_item').remove();
                        renderUrl(dockingCnt);
                    }
                }
            });
        }).on('change','.docking_content select',function(){
            // 动态改变上方全址url
            renderUrl($(this).closest('.docking_content'));
        }).on('keyup','.docking_content input',function(){
            // 动态改变上方全址url
            renderUrl($(this).closest('.docking_content'));
        });
    });