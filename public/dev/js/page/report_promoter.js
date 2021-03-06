$(function(){
    // 当选择单个特邀用户时，存取单个特邀用户的id;
    var query_one;
    var $tip_ct = $(".filter_ct");
    // 日期控件初始化及赋值
    var start_date = base.calDate('d',-30,new Date);
    var date_start = $(".date_start").val(base.date("y-m-d",start_date)).datepicker({timepicker:false,max: "today",datetime: start_date});
    var date_end = $(".date_end").val(base.now("y-m-d")).datepicker({timepicker:false,min: start_date,max: "today"});
    // 初始化选择特邀用户弹出框
    var sel_guest_user = new Box({
        title:"选择特邀用户",
        html:'<div class="sel_guest_user table_min"></div>',
        css:{
            'min-width': '320px'
        },
        fnSure: function(t){
            var sel_val = $('[name="sel_guest_user"]:checked').val();
            if(sel_val){
                query_one = sel_val;
                getData();
            }else{
                $('.table_filter').operTip("请选择一个特邀用户！",{theme:"danger"});
                return false;
            }
        },
        fnCancel: function(t){
            console.dir(t)
        },
        // html:$(".grid .ct").html()
    });

    // 获取推广人员列表
    function renderSpdSelect(){
        $.ajax({
            url: "http://192.168.1.211:5211/back/promoter/query",
            type: "GET",
            dataType: "json"
        }).done(function(data){
            if(data.status === 1){
                // 渲染推广人员下拉列表
                base.renderOption($("select.query_some"),data.data,['id','name']);
            }else{
                $tip_ct.operTip(data.msg || "获取推广人员列表失败！",{theme: "danger", dir: 'bottom', css:{"white-space": "nowrap"}});
            }
        }).fail(function(e){
            $tip_ct.operTip("获取推广人员列表失败！",{theme: "danger", dir: 'bottom', css:{"white-space": "nowrap"}});
        });
    }

    if(role !== 6){
        renderSpdSelect();
    }else{
        $('select.query_type option[value="some"]').remove();
    }
    
    var chart_url = "http://es2.laizhuan.com/report/caltgTasks";
    // 向后台发送请求并根据数据渲染报表
    function getData(){
        var send_obj = {
            date_start: $(".date_start").val(),
            date_end: $(".date_end").val(),
            query_type: $(".query_type").val(),
            method: "readReport",
            report_type: 2
        };
        var tip = "全部特邀用户";
        if(send_obj.query_type === "some" && $(".query_some").val()){
            send_obj.query_some = $(".query_some").val();
            tip = "部分特邀用户("+$(".query_some option:selected").text()+")";
        }else if(send_obj.query_type === "one" && query_one){
            send_obj.query_one = query_one;
            tip = "特邀用户("+send_obj.query_one+")";
        }else if(send_obj.query_type !== "all"){
            return false;
        }
        if(send_obj.query_type === "all" && role === 6){
            send_obj.query_type = "some";
            send_obj.query_some = person_id;
        }

        $.ajax({
            url: chart_url,
            data: send_obj,
            dataType: "json"
        }).always(function(data) {
            renderChart(data,tip);
        });
        send_obj.report_type = 0;
        renderTable(send_obj);
    }
    
    // 渲染报表
    function renderChart(data,tip){
        var option;
        var list = data.list || data.data || [];
        if(!list.length){
            $tip_ct.operTip("该条件下暂无数据！",{theme: "danger", dir: 'bottom', css:{"white-space": "nowrap"}});
            return;
        }
        if($("#chart_type").prop("checked")){
            option = {
                title: {
                    text: '好友数任务数关系图',
                    subtext: tip,
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return params[0].seriesName + ' : ' + params[0].value + ' (个)<br/>'
                            + params[1].seriesName + ' : ' + params[1].value + ' (个)<br/>'
                            + '合计 : ' + (params[0].value + params[1].value) + ' (个)<br/>';
                    }
                },
                legend: {
                    data:['一级好友','二级好友','一级任务','二级任务'],
                    x: 'center',
                    y: '45%'
                },
                dataZoom: [
                    {
                        show: true,
                        xAxisIndex: [0, 1],
                        backgroundColor: 'rgba(0, 0, 0, .1)',
                        showDataShadow: false,
                        fillerColor: 'rgb(38, 52, 75)',
                        bottom: '45%',
                        handleSize: 5
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0, 1]
                    }
                ],
                grid: [{
                    top: 50,
                    left: 50,
                    right: 50,
                    height: '30%'
                }, {
                    left: 50,
                    right: 50,
                    bottom: 50,
                    height: '30%'
                }],
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisLine: {onZero: true},
                        data: $.map(list, function(item) {
                            return item.day;
                        })
                    },
                    {
                        gridIndex: 1,
                        type : 'category',
                        boundaryGap : false,
                        axisLine: {onZero: true},
                        data: $.map(list, function(item) {
                            return item.day;
                        })
                    }
                ],
                yAxis : [
                    {
                        name : '好友数(个)',
                        type : 'value'
                    },
                    {
                        gridIndex: 1,
                        name : '任务数(个)',
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'一级好友',
                        type:'line',
                        areaStyle: {normal: {}},
                        symbolSize: 5,
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.friend_1;
                        }),
                        stack: "总好友"
                    },
                    {
                        name:'二级好友',
                        type:'line',
                        areaStyle: {normal: {}},
                        symbolSize: 5,
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.friend_2;
                        }),
                        stack: "总好友"
                    },
                    {
                        name:'一级任务',
                        type:'line',
                        areaStyle: {normal: {}},
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        symbolSize: 5,
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.task_1;
                        }),
                        stack: "总任务"
                    },
                    {
                        name:'二级任务',
                        type:'line',
                        areaStyle: {normal: {}},
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        symbolSize: 5,
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.task_2;
                        }),
                        stack: "总任务"
                    }
                ]
            };
        }else{
            option = {
                title : {
                    text: '特邀用户支出费用',
                    subtext: tip,
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return params[0].seriesName + ' : ' + params[0].value + ' (个)'+
                                '<br>'+params[1].seriesName + ' : ' + params[1].value + ' (个)'+
                                '<br>'+params[2].seriesName + ' : ' + params[2].value + ' (元)';
                    }
                },
                grid: {
                    bottom: 100,
                    left: 50,
                    right: 50
                },
                legend: {
                    data:['支出费用','邀请人数','完成任务数'],
                    x: 'left'
                },
                dataZoom: [
                    {
                        show: true,
                        backgroundColor: 'rgba(0, 0, 0, .1)',
                        showDataShadow: false,
                        fillerColor: 'rgb(38, 52, 75)',
                        handleSize: 5
                    }
                ],
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisLine: {onZero: false},
                        data : $.map(list, function(item) {
                            return item.createdAt;
                        })
                    }
                ],
                yAxis: [
                    {
                        name: '支出费用(元)',
                        type: 'value'
                    }
                ],
                series: [{
                        name:'邀请人数',
                        type:'line',
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.inviated_num || 0;
                        })
                    },{
                        name:'完成任务数',
                        type:'line',
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.done_task_num || 0;
                        })
                    },{
                        name:'支出费用',
                        type:'line',
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.cal_fee || 0;
                        })
                    }
                ]
            };
        }
        
        chart.renderChart($(".report_ct")[0],option);
        $('.date_group').toggle($('.table_ct').is('.hidden'));
    }

    var report_table;

    function renderTable(send_obj){
        $('.date_group').toggle(send_obj.report_type !== 0);
        // 渲染表格参数
        var opt = {
            $ct: $(".table_ct"),
            col: [{
                key: "uid",
                title: "特邀用户ID",
                sort: true,
                filter: true
            }, {
                key: "cal_fee",
                title: "理论金额",
                sort: true,
                filter: true
            }, {
                key: "payed_fee",
                title: "支付金额",
                sort: true,
                filter: true
            }, {
                key: "createdAt",
                title: "日期",
                sort: true,
                filter: true,
                cls: "hidden_xs"
            }, {
                key: "done_task_num",
                title: "任务量",
                sort: true,
                filter: true
            }, {
                key: "inviated_num",
                title: "推广量",
                sort: true,
                filter: true
            }],
            // isLocal: true,
            url: "http://es2.laizhuan.com/module/vip_report/interface.php",
            sendData: send_obj
        };
        if(report_table){
            report_table.data = null;
            $.extend(true,report_table.sendData,send_obj);
            report_table.render();
        }else{
            report_table = new Table(opt);
        }
    }
    // 事件
    $(".date_start").bind("change",function(){
        // $(".date_end").val(base.date("y-m-d",base.calDate('m',1,new Date($(this).val()))));
        date_end.cgOpt({min: $(this).val()});
        getData();
    });
    $(".date_end").bind("change",function(){
        // $(".date_start").val(base.date("y-m-d",base.calDate('m',-1,new Date($(this).val()))));
        date_start.cgOpt({max: $(this).val()});
        getData();
    });
    $(".query_type,.query_some").bind("change",function(){
        getData();
    });
    $("#chart_type").bind("change",function(){
        var isChecked = $("#chart_type").prop("checked");
        $(".btn_toggle_chart_table").toggleClass('hidden');
        if(!isChecked){
            chart_url = "http://es2.laizhuan.com/module/vip_report/interface.php";
        }else{
            chart_url = "http://es2.laizhuan.com/report/caltgTasks";
            $(".report_ct.hidden").removeClass("hidden");
            $(".table_ct").addClass('hidden');
        }
        getData();
    });
    // 选择指定特邀用户
    $(".query_one").bind("click",function(){
        sel_guest_user.show();
        var opt = {
            $ct: $(".sel_guest_user"),
            col: [{
                key: "uid",
                width: 20,
                render: function(a, b) {
                    var btn_query = $('<label class="radio"><input type="radio" value="'+b+'" name="sel_guest_user"><span class="opt_imitate"></span></label>');
                    a.append(btn_query);
                }
            }, {
                key: "uid",
                title: "用户ID",
                sort: true,
                filter: true
            }, {
                key: "type",
                title: "类别",
                sort: false,
                filter: true
            }, {
                key: "name",
                title: "姓名",
                sort: false,
                filter: true
            }, {
                key: "pay",
                title: "费用",
                sort: false,
                filter: true,
                cls: "hidden_xs"
            }, {
                key: "alipay",
                title: "支付宝",
                sort: false,
                filter: true,
                cls: "hidden_xs"
            }],
            isLocal: true,
            theme: 'lightblue',
            url: "http://192.168.1.211:5211/back/guest_user/query"
        };
        if(role !== 6){
            opt.col.splice(1,0,{
                key: "pname",
                title: "推广人员",
                sort: true,
                filter: true
            });
        }
        !$(".sel_guest_user .table").length && new Table(opt);
    });
    
    $('body').on('click','.sel_guest_user tbody tr',function(){
        // 行点击选中
        $(this).find('[type="radio"]').prop("checked",true);
    }).on('click','.btn_toggle_chart_table',function(){
        $(".report_ct,.table_ct").toggleClass('hidden');
        getData();
    }).on('click','.btn_toggle_table',function(){
        report_table.sendData.report_type = 1-(report_table.sendData.report_type);
        report_table.sendData.cur_page = 1;
        report_table.data = null;
        report_table.render();

        $('.date_group').toggle(report_table.sendData.report_type !== 0);
    });
    
    if(base.getParam('id')){
        $('.query_type').val('one').trigger('change');
        query_one = base.getParam('id');
        $("#chart_type").prop("checked",base.getParam('type') !== 'money');
        getData();
    }else{
        getData();
    }
});